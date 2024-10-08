"use client";
import { IOrder, OrderStatus } from "@/types/order.type";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";

interface IGetOrdersQuery extends IPaginationQueries {
  id: number;
  search?: string;
  status?: OrderStatus | null ;
  category?: string
  fromDate?: string
  toDate?: string
}

const useGetUserOrders = (queries: IGetOrdersQuery) => {
  const {axiosInstance} =useAxios()
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
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
  }, [queries?.page, queries?.search, queries.status, queries.category, queries.fromDate, queries.toDate]);
  return {orders, meta, isLoading};
};

export default useGetUserOrders;
