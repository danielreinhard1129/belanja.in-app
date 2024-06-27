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
import useGetCategories from "@/hooks/api/category/useGetCategories";
import useUpdateCategory from "@/hooks/api/category/useUpdateCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Loader2, Settings, Trash } from "lucide-react";
import React, { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import {
  SchemaCreateCategory,
  defaultValues,
  schemaCreateCategory,
} from "./schemaCreateCategory";

interface DialogSettingsCategoryProps {
  refetch: () => void;
}

const DialogSettingsCategory: React.FC<DialogSettingsCategoryProps> = ({
  refetch,
}) => {
  const { createCategory, isLoading: isCreating } = useCreateCategory();
  const { updateCategory, isLoading: isUpdating } = useUpdateCategory();
  const { deleteCategory } = useDeleteCategory();
  const { categories } = useGetCategories();
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
  const { reset, handleSubmit } = methods;

  const onSubmit: SubmitHandler<SchemaCreateCategory> = async (data) => {
    if (editingCategory && editingCategory.id !== undefined) {
      await updateCategory(data, editingCategory.id);
    } else {
      await createCategory(data);
    }
    refetch();
    reset(defaultValues);
    setEditingCategory(null);
    console.log(data);
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
    } finally {
      setDeletingCategoryId(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Settings size={20} color="black" />
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
                disabled={isCreating || isUpdating}
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
