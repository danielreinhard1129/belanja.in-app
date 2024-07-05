"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
// import Select from 'react-select';
import { FormInput } from "@/components/FormInput";
import ImageUploader from "@/components/FormInputImages";
import useCreateProduct from "@/hooks/api/product/useCreateProduct";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Controller,
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import { toast } from "sonner";
import {
  TCreateProductSchema,
  createProductSchema,
  defaultValues,
} from "../validationSchema/CreateProductSchema";

// Dynamic import for react-select
const Select = dynamic(() => import("react-select"), { ssr: false });

interface DialogCreateProductProps {
  refetch: () => void;
  categories: { id: number; name: string }[];
}

const DialogCreateProduct: React.FC<DialogCreateProductProps> = ({
  refetch,
  categories,
}) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { createProduct, isLoading } = useCreateProduct();
  const methods = useForm<TCreateProductSchema>({
    mode: "all",
    resolver: zodResolver(createProductSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });

  const handleFileChange = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      const existingFiles = getValues("images") || [];
      const allFiles = existingFiles.concat(newFiles);

      if (allFiles.length > 4) {
        toast.error("You can only upload up to 4 images");
        return;
      }
      setValue("images", allFiles);
      // Create image previews
      const previews = allFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews(previews);
    }
  };

  const handleRemoveImage = (index: number) => {
    // Remove from imagePreviews
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);

    // Remove from images in form data
    const imagesFormData = getValues("images") || [];
    const updatedImages = [...imagesFormData];
    updatedImages.splice(index, 1);
    setValue("images", updatedImages);
  };

  const handleReset = () => {
    reset(defaultValues);
    setImagePreviews([]);
  };

  const onSubmit: SubmitHandler<TCreateProductSchema> = async (data) => {
    try {
      await createProduct(data);
      refetch();
      handleReset();
      setIsOpen(false);
    } catch (error) {
      if (typeof error === "string") {
        toast.error(error);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const categoryOptions = categories.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex items-center justify-between gap-2">
        <div className="inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md bg-[#ff6100] px-4 py-2 text-sm font-medium text-white ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <Plus />
          Product
        </div>
      </DialogTrigger>
      <DialogContent>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Create Product</DialogTitle>
              <DialogDescription>
                Buat produk dengan beberapa kategori dan gambar
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <FormInput<TCreateProductSchema>
                name="name"
                label="Name"
                type="text"
                placeholder="Name"
              />
              <div className="mt-2">
                <FormInput<TCreateProductSchema>
                  name="description"
                  label="Description"
                  type="text"
                  placeholder="Description"
                />
              </div>
              <div className="mt-2 grid grid-cols-2 gap-4">
                <div className="col-span-1">
                  <Label>Price</Label>
                  <FormInput<TCreateProductSchema>
                    name="price"
                    label=""
                    type="number"
                    placeholder="Price"
                  />
                </div>
                <div className="col-span-1">
                  <Label>Weight</Label>
                  <FormInput<TCreateProductSchema>
                    name="weight"
                    label=""
                    type="number"
                    placeholder="Weight"
                  />
                </div>
              </div>
              <div className="mt-2">
                <Label>Categories</Label>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field: { value, onBlur, onChange, name } }) => (
                    <Select
                      isMulti
                      value={value}
                      onBlur={onBlur}
                      name={name}
                      options={categoryOptions}
                      onChange={(selectedOption) => onChange(selectedOption)}
                    />
                  )}
                />
                {errors.categories && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.categories.message}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <ImageUploader
                  name="images"
                  label="Images"
                  imagePreviews={imagePreviews}
                  handleFileChange={handleFileChange}
                  handleRemoveImage={handleRemoveImage}
                />
              </div>
            </div>
            <DialogFooter className="mt-4 flex justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                className="px-4 py-2"
              >
                Reset
              </Button>
              <Button
                disabled={!isDirty || !isValid || isLoading}
                type="submit"
                className="px-4 py-2"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Loading" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreateProduct;
