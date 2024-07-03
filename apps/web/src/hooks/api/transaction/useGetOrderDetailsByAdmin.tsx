"use client";
import { IOrder } from "@/types/order.type";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";

const useGetOrderDetailsByAdmin = (queries: { orderId?: number }) => {
  const { axiosInstance } = useAxios();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getOrderDetailsByAdmin = async () => {
    try {
      if (!queries.orderId) {
        return "no order detail loaded. no orderId";
      } else {
        await new Promise<void>((res) => setTimeout(res, 500));
        const { data } = await axiosInstance.get("/orders/admin/order", {
          params: queries,
        });

        setOrder(data.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetailsByAdmin();
  }, [queries?.orderId]);
  return { order, setOrder, isLoading, refetch: getOrderDetailsByAdmin };
};

export default useGetOrderDetailsByAdmin;
