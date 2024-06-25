"use client";

import { axiosInstance } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";
import { Product, IFormProduct } from "@/types/product.type";
import axios, { AxiosError } from "axios";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useCreateProduct = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const { token, id } = useAppSelector((state) => state.user);
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

      await axiosInstance.post<Product>("/products", createProductForm, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        description: "Product created successfully!",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          description: error?.response?.data?.message || error?.response?.data,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { createProduct, isLoading };
};

export default useCreateProduct;
