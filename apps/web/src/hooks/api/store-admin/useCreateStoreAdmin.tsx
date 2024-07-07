"use client";

import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

interface CreateStoreAdmin {
  nip: number;
  name: string;
  email: string;
}

const useCreateStoreAdmin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const createStoreAdmin = async (data: CreateStoreAdmin) => {
    setIsLoading(true);
    try {
      const payload = {
        nip: data.nip,
        name: data.name,
        email: data.email,
      };

      const response = await axiosInstance.post("/store-admins", payload);
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

  return { createStoreAdmin, isLoading };
};

export default useCreateStoreAdmin;
