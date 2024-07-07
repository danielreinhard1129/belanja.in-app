"use client";

import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { StoreProduct } from "@/types/storeProduct.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";

interface IGetProductsQuery {
  take?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: string;
  lat?: number;
  long?: number;
  search?: string;
  category?: string;
}

const useGetProductsByLocation = (queries: IGetProductsQuery) => {
  const [data, setData] = useState<StoreProduct[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { axiosInstance } = useAxios();

  const getProducts = async () => {
    try {
      const { data } = await axiosInstance.get("/products/location", {
        params: queries,
      });

      setData(data.data);
      setMeta(data.meta);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [queries.page, queries.sortOrder, queries.lat, queries.long]);
  return { data, isLoading, meta, refetch: getProducts };
};

export default useGetProductsByLocation;
