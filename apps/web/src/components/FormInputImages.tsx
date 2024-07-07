import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Trash2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

interface ImageUploaderProps {
  name: string;
  label: string;
  imagePreviews: string[];
  handleFileChange: (files: FileList | null) => void;
  handleRemoveImage: (index: number) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  name,
  label,
  imagePreviews,
  handleFileChange,
  handleRemoveImage,
}) => {
  const { control } = useFormContext();
  const clearInputFile = () => {
    const input = document.getElementById("fileInput") as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };
  return (
    <>
      <div className="mt-4">
        <Label>{label}</Label>
        <Controller
          name={name}
          control={control}
          render={({
            field: { onChange, value, ...field },
            fieldState: { error },
          }) => (
            <>
              <Input
                {...field}
                id="fileInput"
                type="file"
                onChange={(e) => {
                  handleFileChange(e.target.files);
                }}
                className={`mr-4 ${error ? "border-red-500" : ""}`}
                multiple
              />
              <div className="mt-1 text-xs text-red-500">
                {error && <p>{error.message}</p>}
              </div>
            </>
          )}
        />
      </div>
      <div className="mt-4 flex gap-4">
        {imagePreviews.map((preview, index) => (
          <div key={index} className="relative">
            <Image
              src={preview}
              alt={`Preview ${index + 1}`}
              width={100}
              height={100}
              style={{ objectFit: "cover", width: "100px", height: "100px" }}
              priority={true}
            />
            <button
              type="button"
              className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white"
              onClick={() => {
                handleRemoveImage(index);
                clearInputFile();
              }}
            >
              <Trash2 />
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default ImageUploader;
