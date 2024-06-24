"use client";

import { axiosInstance } from "@/lib/axios";
import { Store } from "@/types/store.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const getStores = async () => {
    try {
      const { data } = await axiosInstance.get<Store[]>("/stores");
      console.log(data);
      setStores(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching product:", error.message);
      }
    }
  };
  useEffect(() => {
    getStores();
  }, []);

  return { stores, refetch: getStores };
};

export default useGetStores;
