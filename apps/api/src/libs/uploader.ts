import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';
import { join } from 'path';

type DestinationCallback = (error: Error | null, destination: string) => void;
type FilenameCallback = (error: Error | null, filename: string) => void;

export const uploader = (
  filePrefix: string,
  folderName: string,
  filelimit?: number,
) => {
  const defaultDir = join(__dirname, '../../public');

  const storage = multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback,
    ) => {
      const destination = folderName ? defaultDir + folderName : defaultDir;
      cb(null, destination);
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      callback: FilenameCallback,
    ) => {
      const originalNameParts = file.originalname.split('.');
      const fileExtension = originalNameParts[originalNameParts.length - 1];
      const newFileName = filePrefix + Date.now() + '.' + fileExtension;

      callback(null, newFileName);
    },
  });

  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const extAllowed = /\.(jpg|jpeg|png|webp|avif)$/;
    const isExtMatch = file.originalname.toLowerCase().match(extAllowed);
    if (isExtMatch) {
      cb(null, true);
    } else {
      const error = new Error('Your file extenstion is denied');
      cb(null, false);
      cb(error);
    }
  };

  const limits = { fileSize: filelimit || 1 * 1024 * 1024 };

  return multer({ storage, fileFilter, limits });
};
