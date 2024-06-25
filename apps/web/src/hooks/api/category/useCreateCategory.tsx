"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { IFormCategory } from "@/types/category.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useCreateCategory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const userId = "1";
  const createCategory = async (data: IFormCategory) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        userId: userId,
      };

      await axiosInstance.post("/categories/", payload);
      toast({
        description: "Category created successfully!",
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
  return { createCategory, isLoading };
};

export default useCreateCategory;
