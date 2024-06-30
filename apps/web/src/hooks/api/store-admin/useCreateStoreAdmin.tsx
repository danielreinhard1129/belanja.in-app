"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";

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

      // Lakukan permintaan POST
      const response = await axiosInstance.post("/store-admins", payload);

      // Jika berhasil, tampilkan pesan toast success dengan pesan dari server
      toast.success(
        response.data.message || "Store Admin created successfully!",
      );
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
