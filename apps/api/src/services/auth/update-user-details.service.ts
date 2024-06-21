import prisma from '@/prisma';
import { User } from '@prisma/client';
import { join } from 'path';
import fs from 'fs';

const defaultDir = '../../../public/images';

export const updateUserDetailsService = async (
  userId: number,
  body: Partial<Pick<User, 'email' | 'name' | 'gender' | 'birthDate' | 'avatarUrl'>>,
  file?: Express.Multer.File,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // if (body.email && body.email !== user.email) {
    //   const userEmail = await prisma.user.findFirst({
    //     where: { email: { equals: body.email } },
    //   });
    //   if (userEmail) {
    //     throw new Error('Email already in use');
    //   }
    // }

    let avatarUrl = user.avatarUrl;

    if (file) {
      avatarUrl = `/images/${file.filename}`;
      const imagePath = join(__dirname, '../../../public' + user.avatarUrl);
    }

    const userDetails = await prisma.user.update({
      where: { id: userId },
      data: {
        ...body,
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        avatarUrl: file ? avatarUrl : user.avatarUrl,
      },
    });

    return {
      message: 'Update user details success',
      data: userDetails,
    };
  } catch (error) {
    if (file) {
      const imagePath = join(__dirname, defaultDir, file.filename);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    throw error;
  }
};
