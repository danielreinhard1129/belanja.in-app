"use client";

import { axiosInstance } from "@/lib/axios";
import { StoreAdmin } from "@/types/storeAdmin.type";
import { useEffect, useState } from "react";

const useGetStoreAdminNoStore = () => {
  const [storeAdmins, setStoreAdmins] = useState<StoreAdmin[]>([]);

  useEffect(() => {
    const getStoreAdminsNoStore = async () => {
      try {
        const { data } = await axiosInstance.get<StoreAdmin[]>(
          "/store-admins/no-store",
        );
        setStoreAdmins(data);
      } catch (error) {
        setStoreAdmins([]);
      }
    };

    getStoreAdminsNoStore();
  }, []);

  return { storeAdmins };
};

export default useGetStoreAdminNoStore;
