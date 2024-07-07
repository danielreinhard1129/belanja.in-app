"use client";

import { FormInput } from "@/components/FormInput";
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
import useCreateCategory from "@/hooks/api/category/useCreateCategory";
import useDeleteCategory from "@/hooks/api/category/useDeleteCategory";
import useUpdateCategory from "@/hooks/api/category/useUpdateCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Plus, Trash } from "lucide-react";
import React, { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormState,
} from "react-hook-form";
import {
  SchemaCreateCategory,
  defaultValues,
  schemaCreateCategory,
} from "../validationSchema/schemaCreateCategory";

interface DialogSettingsCategoryProps {
  refetch: () => void;
  refetchCategories: () => void;
  categories: { id: number; name: string }[];
}

const DialogSettingsCategory: React.FC<DialogSettingsCategoryProps> = ({
  refetch,
  refetchCategories,
  categories,
}) => {
  const { createCategory, isLoading: isCreating } = useCreateCategory();
  const { updateCategory, isLoading: isUpdating } = useUpdateCategory();
  const { deleteCategory } = useDeleteCategory();
  const [editingCategory, setEditingCategory] =
    useState<SchemaCreateCategory | null>(null);
  const [deletingCategoryId, setDeletingCategoryId] = useState<number | null>(
    null,
  );

  const methods = useForm<SchemaCreateCategory>({
    mode: "all",
    resolver: zodResolver(schemaCreateCategory),
    defaultValues,
  });
  const { reset, handleSubmit, control } = methods;
  const { isDirty, isValid } = useFormState({
    control,
  });

  const onSubmit: SubmitHandler<SchemaCreateCategory> = async (data) => {
    if (editingCategory && editingCategory.id !== undefined) {
      await updateCategory(data, editingCategory.id);
    } else {
      await createCategory(data);
    }
    refetch();
    refetchCategories();
    reset(defaultValues);
    setEditingCategory(null);
  };

  const handleEdit = (category: SchemaCreateCategory) => {
    setEditingCategory(category);
    reset(category);
  };

  const handleDelete = async (categoryId: number) => {
    setDeletingCategoryId(categoryId);
    try {
      await deleteCategory(categoryId);
      refetch();
      refetchCategories();
    } finally {
      setDeletingCategoryId(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="flex items-center justify-between gap-2">
        <div className="inline-flex h-10 items-center justify-center gap-1 whitespace-nowrap rounded-md bg-[#ff6100] px-4 py-2 text-sm font-medium text-white">
          <Plus />
          Category
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[350px]">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add Category"}
              </DialogTitle>
              <DialogDescription>
                {editingCategory
                  ? "Update the category details"
                  : "Add a new category"}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <FormInput<SchemaCreateCategory>
                name="name"
                label=""
                type="text"
                placeholder="Name"
              />
            </div>
            <DialogFooter className="mt-4 flex justify-end">
              <Button
                type="button"
                onClick={() => {
                  reset(defaultValues);
                  setEditingCategory(null);
                }}
                className="px-4 py-2"
                variant="secondary"
              >
                Reset
              </Button>
              <Button
                disabled={!isDirty || !isValid || isCreating || isUpdating}
                type="submit"
                className="px-4 py-2"
              >
                {(isCreating || isUpdating) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isCreating || isUpdating
                  ? "Loading"
                  : editingCategory
                    ? "Update"
                    : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
        <div className="mt-4">
          <h3 className="text-lg font-medium">Categories</h3>
          <ul>
            {categories.map((category) => (
              <li
                key={category.id}
                className="mt-2 flex items-center justify-between"
              >
                <span>{category.name}</span>
                <div>
                  <Button
                    onClick={() => handleEdit(category)}
                    className="mr-2 px-4 py-2"
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    disabled={deletingCategoryId === category.id}
                    onClick={() => handleDelete(category.id)}
                    className="px-4 py-2"
                    variant="destructive"
                  >
                    {deletingCategoryId === category.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash size={16} />
                    )}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogSettingsCategory;
