"use client";

import { axiosInstance } from "@/lib/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { Store } from "@/types/store.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetEventsQuery extends IPaginationQueries {
  search?: string;
}

const useGetStores = (queries: IGetEventsQuery) => {
  const [data, setData] = useState<Store[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getStores = async () => {
    try {
      const { data } = await axiosInstance.get<Store[]>("/stores", {
        params: queries,
      });
      setData(data.data);
      setMeta(data.meta);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching stores:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getStores();
  }, [queries?.page, queries?.search, queries?.sortOrder]);

  return { data, isLoading, meta, refetch: getStores };
};

export default useGetStores;
