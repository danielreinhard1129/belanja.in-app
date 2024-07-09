"use client";
import { IOrderArgs } from "@/types/order.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import useAxios from "../useAxios";
import { toast } from "sonner";
import { useState } from "react";

const useCreateNewOrder = () => {
  const { axiosInstance } = useAxios();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter();
  const createNewOrder = async (payload: IOrderArgs) => {
    try {
      setIsLoading(true)
      const location = localStorage.getItem("location");
      if (!location) {
        toast.error("Location access not given, not allowed to checkout")
        return
      }
      const { data } = await axiosInstance.post(
        "/orders/user/new-order",
        payload,
      );
      
      await new Promise<void>((res)=>setTimeout(res, 500))
      router.push(`/order-details/${data.order.id}`)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data);
        setIsLoading(false)
      }
    } finally {
      setIsLoading(false)
    }
  };
  return { createNewOrder, isLoading };
};

export default useCreateNewOrder;
