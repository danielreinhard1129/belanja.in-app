"use client";

import { axiosInstance } from "@/lib/axios";
import { Product } from "@/types/product.type";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetProduct = (id: number) => {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axiosInstance.get<Product>(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error fetching product:", error.message);
        }
      }
    };

    getProduct();
  }, [id]);

  return { product };
};

export default useGetProduct;
