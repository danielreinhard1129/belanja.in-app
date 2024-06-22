"use client";

import { axiosInstance } from "@/lib/axios";
import { Category } from "@/types/category.type";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const { data } = await axiosInstance.get<Category[]>("/categories/");
        setCategories(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error fetching categories:", error.message);
        }
      }
    };

    getCategories();
    // Polling every 10 seconds
    const intervalId = setInterval(getCategories, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return { categories };
};

export default useGetCategories;
