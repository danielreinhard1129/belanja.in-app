import { Product } from "@/types/product.type";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

interface IGetEventsQuery extends IPaginationQueries {
  search?: string;
  category?: string;
}

const useGetProductsByFilter = (queries: IGetEventsQuery) => {
  const [data, setData] = useState<Product[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getProductsByFilter = async () => {
    try {
      const { data } = await axiosInstance.get("/products/filter", {
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
    getProductsByFilter();
  }, [queries?.page, queries?.search, queries?.category, queries?.sortOrder]);

  return { data, isLoading, meta, refetch: getProductsByFilter };
};

export default useGetProductsByFilter;
