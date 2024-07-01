"use client";

import axiosInstance from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";

const useDeleteUserAddress = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const deleteAddress = async (addressId: number) => {
    try {
      setIsLoading(true);

      await axiosInstance.delete(`/address/${addressId}`);
      toast.success("Address deleted successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteAddress, isLoading };
};

export default useDeleteUserAddress;
