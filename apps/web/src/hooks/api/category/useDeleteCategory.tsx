"use client";

import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useDeleteCategory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deleteCategory = async (categoryId: number) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.delete(`/categories/${categoryId}`);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { deleteCategory, isLoading };
};

export default useDeleteCategory;
