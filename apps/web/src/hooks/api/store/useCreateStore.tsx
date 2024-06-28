"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { IFormStore } from "@/types/store.type";
import { AxiosError } from "axios";
import { useState } from "react";

const useCreateStore = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createStore = async (data: IFormStore) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        cityId: data.cityId,
        lat: data.lat,
        long: data.long,
        storeAdminId: String(data.storeAdminId),
      };

      await axiosInstance.post("/stores", payload);
      toast.success("Store created successfully!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { createStore, isLoading };
};

export default useCreateStore;
