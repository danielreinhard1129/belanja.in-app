"use client";

import { axiosInstance } from "@/lib/axios";
import { AddressData } from "@/types/address.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetUserAddress = (userId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [addresses, setAddresses] = useState<AddressData>([]);

  const getUserAddress = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get<AddressData>(
        `/address/${userId}`,
      );

      setAddresses(data);
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
  }, [userId]);
  return { isLoading, addresses, refetch: getUserAddress, setAddresses };
};

export default useGetUserAddress;
