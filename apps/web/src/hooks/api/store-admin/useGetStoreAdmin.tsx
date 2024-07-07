"use client";

import { axiosInstance } from "@/lib/axios";
import { StoreAdmin } from "@/types/storeAdmin.type";
import { useEffect, useState } from "react";

const useGetStoreAdmin = () => {
  const [storeAdmins, setStoreAdmins] = useState<StoreAdmin[]>([]);

  useEffect(() => {
    const getStoreAdmins = async () => {
      try {
        const { data } =
          await axiosInstance.get<StoreAdmin[]>("/store-admins/");
        setStoreAdmins(data);
      } catch (error) {
        setStoreAdmins([]);
      }
    };

    getStoreAdmins();
  }, []);

  return { storeAdmins };
};

export default useGetStoreAdmin;
