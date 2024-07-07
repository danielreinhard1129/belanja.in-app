"use client";

import { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import useAxios from "../useAxios";

const useDeleteUserAddress = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { axiosInstance } = useAxios();

  const deleteAddress = async (addressId: number) => {
    try {
      await axiosInstance.delete(`/addresses/${addressId}`);
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
