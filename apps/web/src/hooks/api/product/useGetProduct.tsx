"use client";

import { useEffect, useState } from "react";
import useAxios from "../useAxios";
import { StoreProduct } from "@/types/storeProduct.type";

interface IProductQuery {
  lat?: number;
  long?: number;
  productId: number;
}

const useGetProduct = (queries: IProductQuery) => {
  const { axiosInstance } = useAxios();
  const [storeProduct, setStoreProduct] = useState<StoreProduct | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);

  const getProduct = async () => {
    try {
      const { data } = await axiosInstance.get<StoreProduct>(`/products/id`, {
        params: queries,
      });
      setStoreProduct(data);
    } catch (error) {
      setStoreProduct(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProduct();
  }, [queries.lat, queries.long, queries.productId]);

  return { storeProduct, isLoading, refetch: getProduct };
};

export default useGetProduct;
