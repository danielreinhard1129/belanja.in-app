"use client";

import { ICart } from "@/types/order.type";
import { Address } from "@/types/user.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";

const useGetUserAddress = (userId: number) => {
  const {axiosInstance} = useAxios()
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const getAddresses = async () => {
    try {
      const { data } = await axiosInstance.get(`/address/user-address`);
      setAddresses(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching address:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAddresses();
  }, []);
  return { addresses, isLoading, refetch: getAddresses, setAddresses };
};

export default useGetUserAddress;
