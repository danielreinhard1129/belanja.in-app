"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormCategory } from "@/types/category.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useCreateCategory = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { id } = useAppSelector((state) => state.user);
  const createCategory = async (data: IFormCategory) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        userId: id,
      };

      const response = await axiosInstance.post("/categories/", payload);
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
  return { createCategory, isLoading };
};

export default useCreateCategory;
