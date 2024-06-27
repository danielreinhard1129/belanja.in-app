"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormCategory } from "@/types/category.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useUpdateCategory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAppSelector((state) => state.user);
  const updateCategory = async (data: IFormCategory, categoryId: number) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        userId: id,
      };

      await axiosInstance.patch(`/categories/${categoryId}`, payload);
      toast.success("Category updated succesfully");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateCategory, isLoading };
};

export default useUpdateCategory;
