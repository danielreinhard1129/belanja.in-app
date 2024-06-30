"use client";
import { toast } from "@/components/ui/use-toast";
import { IOrderArgs } from "@/types/order.type";
import { AxiosError } from "axios";
import useAxios from "../useAxios";

const useCreateNewOrder = () => {
  const  {axiosInstance} = useAxios()
  const createNewOrder = async (payload: IOrderArgs) => {
    try {
      const { data } = await axiosInstance.post(
        "orders/user/new-order",
        payload,
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          description: error?.response?.data,
        });
      }
    }
  };
  return { createNewOrder };
};

export default useCreateNewOrder;
