import { axiosInstance } from "@/lib/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { Product } from "@/types/product.type";
import { useEffect, useState } from "react";

interface IGetEventsQuery extends IPaginationQueries {
  search?: string;
  category?: string;
}

const useGetProductsByFilters = (queries: IGetEventsQuery) => {
  const [data, setData] = useState<Product[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getProductsByFilters = async () => {
    try {
      const { data } = await axiosInstance.get("/products/filters", {
        params: queries,
      });

      setData(data.data);
      setMeta(data.meta);
    } catch (error) {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProductsByFilters();
  }, [queries?.page, queries?.search, queries?.category, queries?.sortOrder]);

  return { data, isLoading, meta, refetch: getProductsByFilters };
};

export default useGetProductsByFilters;
