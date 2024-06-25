"use client";

import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";

const useDeleteCategory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const deleteCategory = async (categoryId: number) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/categories/${categoryId}`);
      toast({
        description: "Category deleted successfully!",
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
  return { deleteCategory, isLoading };
};

export default useDeleteCategory;
