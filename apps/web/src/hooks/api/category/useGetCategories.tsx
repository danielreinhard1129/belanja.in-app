"use client";

import { axiosInstance } from "@/lib/axios";
import { Category } from "@/types/category.type";
import { useEffect, useState } from "react";

const useGetCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const getCategories = async () => {
    try {
      const { data } = await axiosInstance.get<Category[]>("/categories");
      setCategories(data);
    } catch (error) {
      setCategories([]);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  return { categories, refetch: getCategories };
};

export default useGetCategories;
