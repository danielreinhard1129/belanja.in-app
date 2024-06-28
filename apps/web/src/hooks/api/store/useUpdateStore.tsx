"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IFormStore } from "@/types/store.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useUpdateStore = (storeId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("Authorization")?.split(" ")[1];
  const updateStore = async (data: IFormStore) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        cityId: data.cityId,
        lat: data.lat,
        long: data.long,
        storeAdminId: String(data.storeAdminId),
      };

      await axiosInstance.patch(`/stores/${storeId}`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Store updated successfully!");
      toast.success("Store updated successfully!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateStore, isLoading };
};

export default useUpdateStore;
