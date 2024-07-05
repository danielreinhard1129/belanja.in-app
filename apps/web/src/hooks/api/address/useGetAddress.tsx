"use client";

import { axiosInstance } from "@/lib/axios";
import { Address } from "@/types/address.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetAddress = (addressId: number) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [address, setAddress] = useState<Address>();

  const getAddress = async () => {
    try {
      const { data } = await axiosInstance.get<Address>(
        `/addresses/${addressId}`,
      );

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
    getAddress();
  }, [addressId]);
  return { isLoading, address, refetch: getAddress };
};

export default useGetAddress;
