"use client";

import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormCategory } from "@/types/category.type";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

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

      const response = await axiosInstance.patch(
        `/categories/${categoryId}`,
        payload,
      );
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
  return { updateCategory, isLoading };
};

export default useUpdateCategory;
