"use client";

import { axiosInstance } from "@/lib/axios";
import { Store } from "@/types/store.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetStoreByStoreAdmin = (id: number | null) => {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    if (id === null) {
      return;
    }

    const getStoreByStoreAdmin = async () => {
      try {
        const { data } = await axiosInstance.get<Store>(
          `/stores/store-admin/${id}`,
        );
        setStore(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error fetching store:", error.message);
        }
      }
    };

    getStoreByStoreAdmin();
  }, [id]);

  return { store };
};

export default useGetStoreByStoreAdmin;
