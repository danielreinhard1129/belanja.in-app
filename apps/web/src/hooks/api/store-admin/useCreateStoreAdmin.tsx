"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useState } from "react";

interface CreateStoreAdmin {
  nip: number;
  userId: string;
}

const useCreateStoreAdmin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("Authorization")?.split(" ")[1];
  const createStoreAdmin = async (data: CreateStoreAdmin) => {
    setIsLoading(true);
    try {
      const payload = {
        nip: data.nip,
        userId: Number(data.userId),
      };

      await axiosInstance.post("/store-admin", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
  return { createStoreAdmin, isLoading };
};

export default useCreateStoreAdmin;
