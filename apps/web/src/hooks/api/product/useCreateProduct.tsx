"use client";

import { axiosInstance } from "@/libs/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormProduct } from "@/types/product.type";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAppSelector((state) => state.user);
  const createProduct = async (data: IFormProduct) => {
    setIsLoading(true);
    try {
      const createProductForm = new FormData();

      createProductForm.append("name", data.name);
      createProductForm.append("description", data.description);
      createProductForm.append("price", String(data.price));
      createProductForm.append("weight", String(data.weight));
      const categories = data.categories.map((category) =>
        parseInt(category.value),
      );
      createProductForm.append("categories", JSON.stringify(categories));
      createProductForm.append("user", String(id));
      data.images?.forEach((file: File) => {
        createProductForm.append("images", file);
      });
      const response = await axiosInstance.post("/products", createProductForm);
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        throw error.response?.data;
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { createProduct, isLoading };
};

export default useCreateProduct;
