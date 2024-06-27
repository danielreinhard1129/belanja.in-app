"use client";

import { axiosInstance } from "@/lib/axios";
import { Store } from "@/types/store.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetStore = (id: number) => {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const getStore = async () => {
      try {
        const { data } = await axiosInstance.get<Store>(`/stores/${id}`);
        setStore(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error fetching product:", error.message);
        }
      }
    };

    getStore();
  }, [id]);

  return { store };
};

export default useGetStore;
