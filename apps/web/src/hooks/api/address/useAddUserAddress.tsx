"use client";

import axiosInstance from "@/libs/axios";
import { Address } from "@/types/address.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const useAddUserAddress = (userId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  const addUserAddress = async (payload: Address) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.post(
        `/address/add-address`,
        payload,
      );

      toast.success(`${data.message}`);
      router.push(`/user/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(`Error: ${error.response?.data}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { addUserAddress, isLoading };
};

export default useAddUserAddress;
