"use client";

import { axiosInstance } from "@/libs/axios";
import { IFormStore } from "@/types/store.type";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useUpdateStore = (storeId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateStore = async (data: IFormStore) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        cityId: data.cityId,
        storeAdminId: String(data.storeAdminId),
      };

      const response = await axiosInstance.patch(`/stores/${storeId}`, payload);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        throw error.response?.data;
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateStore, isLoading };
};

export default useUpdateStore;
