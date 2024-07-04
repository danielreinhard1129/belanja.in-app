"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormProduct, Product } from "@/types/product.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useUpdateProduct = (productId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAppSelector((state) => state.user);
  const updateProduct = async (data: IFormProduct) => {
    setIsLoading(true);
    try {
      const updateProductForm = new FormData();

      // Append other fields to FormData
      updateProductForm.append("name", data.name);
      updateProductForm.append("description", data.description);
      updateProductForm.append("price", String(data.price));
      updateProductForm.append("weight", String(data.weight));

      // Convert categories to array of numbers
      const categories = data.categories.map((category) =>
        parseInt(category.value),
      );

      updateProductForm.append("categories", JSON.stringify(categories));
      updateProductForm.append("user", String(id));

      //   Append each image file
      data.images?.forEach((file: File) => {
        updateProductForm.append("images", file);
      });

      const response = await axiosInstance.patch(
        `/products/${productId}`,
        updateProductForm,
      );
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data;
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateProduct, isLoading };
};

export default useUpdateProduct;
