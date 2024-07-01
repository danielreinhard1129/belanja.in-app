"use client";

import { axiosInstance } from "@/lib/axios";
import { ICart } from "@/types/order.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetCartsById = (userId: number) => {
  const [carts, setCarts] = useState<ICart[]>([]);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const getCarts = async () => {
    try {
      const { data } = await axiosInstance.get(`/carts/${userId}`);
      setCarts(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching cart:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCarts();
  }, []);
  return { carts, isLoading, refetch: getCarts , setCarts};
};

export default useGetCartsById;
