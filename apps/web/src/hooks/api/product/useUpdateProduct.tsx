"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { Product, IFormProduct } from "@/types/product.type";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useUpdateProduct = (productId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token, id } = useAppSelector((state) => state.user);
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
      updateProductForm.append("user", String(id));

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
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast({
        description: "Product updated successfully!",
      });
      // router.push("/admin/products");
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
  return { updateProduct, isLoading };
};

export default useUpdateProduct;
