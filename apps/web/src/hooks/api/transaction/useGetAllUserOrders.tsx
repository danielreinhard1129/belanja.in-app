"use client";
import { axiosInstance } from "@/lib/axios";
import { IOrder, OrderStatus } from "@/types/order.type";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";

interface IGetOrdersQuery extends IPaginationQueries {
  search?: string;
  status?: OrderStatus | null ;
  category?: string
  fromDate?: string
  toDate?: string
}

const useGetAllUserOrders = (queries: IGetOrdersQuery) => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getAllUserOrders = async () => {
    try {
        await new Promise<void>((res)=>setTimeout(res, 500))
      const { data } = await axiosInstance.get("/orders/admin", {
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
    getAllUserOrders();
  }, [queries?.page, queries?.search, queries.status, queries.category, queries.fromDate, queries.toDate]);
  return {orders, meta, isLoading, refetch: getAllUserOrders};
};

export default useGetAllUserOrders;
