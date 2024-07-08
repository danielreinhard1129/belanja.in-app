"use client";

import { axiosInstance } from "@/lib/axios";
import { ICart } from "@/types/order.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetCartsById = (userId: number) => {
  const [carts, setCarts] = useState<ICart[]>([]);
  const [cartsCount, setCartsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getCarts = async () => {
    try {
      const { data } = await axiosInstance.get(`/carts/${userId}`);
      setCarts(data.data);
      setCartsCount(data.count);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching cart:", error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (!userId) {
      setCartsCount(0);
      setIsLoading(false);
      return;
    } else {
      getCarts();
    }
  }, [userId]);
  return { carts, isLoading, refetch: getCarts, setCarts, cartsCount };
};

export default useGetCartsById;
