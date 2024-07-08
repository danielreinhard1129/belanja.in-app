"use client";

import { Product } from "@/types/product.type";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";

const useGetProductById = (id: number) => {
  const { axiosInstance } = useAxios();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const getProductById = async () => {
    try {
      const { data } = await axiosInstance.get<Product>(`/products/${id}`);
      setProduct(data);
    } catch (error) {
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProductById();
  }, []);

  return { product, isLoading };
};

export default useGetProductById;
