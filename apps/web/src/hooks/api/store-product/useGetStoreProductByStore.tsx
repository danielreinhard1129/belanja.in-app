"use client";

import { axiosInstance } from "@/lib/axios";
import { Product } from "@/types/product.type";
import { useEffect, useState } from "react";

const useGetProductsByStore = (id: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const getProducts = async () => {
    try {
      const { data } = await axiosInstance.get<Product[]>(
        `/store-products/${id}`,
      );
      setProducts(data);
    } catch (error) {
      setProducts([]);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  return { products, refetch: getProducts };
};

export default useGetProductsByStore;
