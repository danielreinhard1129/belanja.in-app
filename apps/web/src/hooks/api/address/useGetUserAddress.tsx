"use client";

import axiosInstance from "@/libs/axios";
import { AddressData } from "@/types/address.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetUserAddress = (id: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<AddressData>([]);

  const getUserAddress = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get<AddressData>(`/address/${id}`);

      setAddress(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserAddress();
  }, [id]);
  return { isLoading, address, refetch: getUserAddress };
};

export default useGetUserAddress;
