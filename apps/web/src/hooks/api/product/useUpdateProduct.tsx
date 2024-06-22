"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { Product, IFormProduct } from "@/types/product.type";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useUpdateProduct = (productId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
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

      //   Append each image file
      data.images?.forEach((file: File) => {
        updateProductForm.append("images", file);
      });

      await axiosInstance.patch<Product>(
        `/products/${productId}`,
        updateProductForm,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast({
        description: "Product updated successfully!",
      });
      router.push("/admin/product");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          description: error?.response?.data,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateProduct, isLoading };
};

export default useUpdateProduct;
