"use client";

import { axiosInstance } from "@/lib/axios";
import { Province } from "@/types/address.type";
import { IPaginationQueries } from "@/types/pagination.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetProvincesQuery extends IPaginationQueries {}

const useGetProvinces = (queries: IGetProvincesQuery) => {
  const [data, setData] = useState<Province[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getProvinces = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/addresses/provinces", {
        params: queries,
      });

      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProvinces();
  }, [queries?.page, queries?.sortOrder]);
  return { data, isLoading, refetch: getProvinces };
};

export default useGetProvinces;
