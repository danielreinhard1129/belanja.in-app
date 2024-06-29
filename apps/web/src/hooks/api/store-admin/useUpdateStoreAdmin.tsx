"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";

interface UpdateStoreAdmin {
  nip: number;
  name: string;
  email: string;
}

const useUpdateStoreAdmin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateStoreAdmin = async (data: UpdateStoreAdmin, id: number) => {
    setIsLoading(true);
    try {
      const payload = {
        nip: data.nip,
        name: data.name,
        email: data.email,
      };

      await axiosInstance.patch(`/store-admins/${id}`, payload);
      toast.success("Store Admin has been updated!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateStoreAdmin, isLoading };
};

export default useUpdateStoreAdmin;
