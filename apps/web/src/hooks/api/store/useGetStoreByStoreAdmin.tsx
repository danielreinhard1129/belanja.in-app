"use client";

import { axiosInstance } from "@/lib/axios";
import { Store } from "@/types/store.type";
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
        setStore(null);
      }
    };

    getStoreByStoreAdmin();
  }, [id]);

  return { store };
};

export default useGetStoreByStoreAdmin;
