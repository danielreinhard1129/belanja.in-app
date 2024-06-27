"use client";

import { axiosInstance } from "@/lib/axios";
import { StoreAdmin } from "@/types/storeAdmin.type";
import { AxiosError } from "axios";
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
        if (error instanceof AxiosError) {
          console.error("Error fetching storeAdmins:", error.message);
        }
      }
    };

    getStoreAdminsNoStore();
  }, []);

  return { storeAdmins };
};

export default useGetStoreAdminNoStore;
