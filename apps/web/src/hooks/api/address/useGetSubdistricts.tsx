"use client";

import axiosInstance from "@/libs/axios";
import { Subdistrict } from "@/types/address.type";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetSubdistrictsQuery extends IPaginationQueries {
  cityId: number;
}

const useGetSubdistricts = (queries: IGetSubdistrictsQuery) => {
  const [data, setData] = useState<Subdistrict[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSubdistricts = async () => {
    try {
      const { data } = await axiosInstance.get("/address/subdistricts", {
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
    getSubdistricts();
  }, [queries?.page, queries?.cityId, queries?.sortOrder]);

  return { data, isLoading, refetch: getSubdistricts };
};

export default useGetSubdistricts;
