"use client";
import { IOrder } from "@/types/order.type";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";



const useGetUserOrder = (queries: { orderId: number }) => {
  const { axiosInstance } = useAxios();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getUserOrder = async () => {
    try {
      await new Promise<void>((res) => setTimeout(res, 500));
      const { data } = await axiosInstance.get("/orders/user/order", {
        params: queries,
      });

      setOrder(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserOrder();
  }, [queries?.orderId]);
  return { order, isLoading, refetch: getUserOrder };
};

export default useGetUserOrder;
