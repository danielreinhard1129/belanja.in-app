"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";

const useDeleteCategory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const deleteCategory = async (categoryId: number) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/categories/${categoryId}`);
      toast.success("Category deleted succesfully");
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
