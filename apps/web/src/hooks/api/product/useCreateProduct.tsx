"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormProduct, Product } from "@/types/product.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAppSelector((state) => state.user);
  const createProduct = async (data: IFormProduct) => {
    setIsLoading(true);
    try {
      const createProductForm = new FormData();

      // Append other fields to FormData
      createProductForm.append("name", data.name);
      createProductForm.append("description", data.description);
      createProductForm.append("price", String(data.price));
      createProductForm.append("weight", String(data.weight));

      // Convert categories to array of numbers
      const categories = data.categories.map((category) =>
        parseInt(category.value),
      );

      createProductForm.append("categories", JSON.stringify(categories));
      createProductForm.append("user", String(id));

      //   Append each image file
      data.images?.forEach((file: File) => {
        createProductForm.append("images", file);
      });

      await axiosInstance.post<Product>("/products", createProductForm);
      toast.success("Product created successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { createProduct, isLoading };
};

export default useCreateProduct;
