"use client";

import { axiosInstance } from "@/lib/axios";
import { City } from "@/types/address.type";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetCitiesQuery extends IPaginationQueries {
  provinceId: string;
}

const useGetCities = (queries: IGetCitiesQuery) => {
  const [data, setData] = useState<City[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getCities = async () => {
    try {
      const { data } = await axiosInstance.get("/addresses/cities", {
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
    getCities();
  }, [queries?.page, queries?.provinceId, queries?.sortOrder]);

  return { data, isLoading, refetch: getCities };
};

export default useGetCities;
