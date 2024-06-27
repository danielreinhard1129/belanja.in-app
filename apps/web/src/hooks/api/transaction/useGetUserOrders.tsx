"use client";
import { axiosInstance } from "@/lib/axios";
import { IOrder, OrderStatus } from "@/types/order.type";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import React, { useEffect, useState } from "react";

interface IGetOrdersQuery extends IPaginationQueries {
  id: number;
  search?: string;
  status?: OrderStatus | null ;
  category?: string
}

const useGetUserOrders = (queries: IGetOrdersQuery) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const getUserOrders = async () => {
    try {
        await new Promise<void>((res)=>setTimeout(res, 500))
      const { data } = await axiosInstance.get("/orders/user", {
        params: queries,
      });

      setOrders(data.data);
      setMeta(data.meta);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, [queries?.page, queries?.search, queries.status, queries.category]);
  return {orders, meta, isLoading};
};

export default useGetUserOrders;
