"use client";

import { axiosInstance } from "@/lib/axios";
import { Category } from "@/types/category.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const getCategories = async () => {
    try {
      const { data } = await axiosInstance.get<Category[]>("/categories");
      setCategories(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching categories:", error.message);
      }
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  return { categories, refetch: getCategories };
};

export default useGetCategories;
