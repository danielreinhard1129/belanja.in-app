"use client";

import { axiosInstance } from "@/lib/axios";
import { CourierService } from "@/types/rajaongkir-response.type";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface DeliveryArgs {
  weight: string;
  origin: string;
  destination: string;
}
const useGetDeliveryFee = (payload: DeliveryArgs) => {
  const [data, setData] = useState<CourierService[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getDeliveryFee = async () => {
    try {
      
      console.log("execute", payload);

      const { data } = await axiosInstance.post<CourierService[]>(
        "delivery/delivery-fee", {payload}

      );
      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
      setIsLoading(true);
    } finally {
      if (!data.length) {
        setIsLoading(true);
      }
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDeliveryFee();
  }, []);
  return { data, isLoading, refetch: getDeliveryFee, setData };
};

export default useGetDeliveryFee;
