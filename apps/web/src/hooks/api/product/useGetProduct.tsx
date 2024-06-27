"use client";

import { Product } from "@/types/product.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";

const useGetProduct = (id: number) => {
  const { axiosInstance } = useAxios();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const getProduct = async () => {
    try {
      const { data } = await axiosInstance.get<Product>(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching product:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, []);

  return { product, isLoading };
};

export default useGetProduct;
