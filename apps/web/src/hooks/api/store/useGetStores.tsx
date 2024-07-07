"use client";

import { axiosInstance } from "@/lib/axios";
import { Store } from "@/types/store.type";
import { useEffect, useState } from "react";

const useGetStores = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const getStores = async () => {
    try {
      const { data } = await axiosInstance.get<Store[]>("/stores");
      setStores(data);
    } catch (error) {
      setStores([]);
    }
  };
  useEffect(() => {
    getStores();
  }, []);

  return { stores, refetch: getStores };
};

export default useGetStores;
