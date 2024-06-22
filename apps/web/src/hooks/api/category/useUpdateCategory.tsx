"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { IFormCategory } from "@/types/category.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useUpdateCategory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const userId = "1";
  const updateCategory = async (data: IFormCategory, categoryId: number) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        userId: userId,
      };

      await axiosInstance.patch(`/categories/${categoryId}`, payload);
      toast({
        description: "Category updated successfully!",
      });
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast({
          description: error?.response?.data,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateCategory, isLoading };
};

export default useUpdateCategory;
