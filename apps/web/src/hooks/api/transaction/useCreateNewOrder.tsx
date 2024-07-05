"use client";
import { toast } from "@/components/ui/use-toast";
import { IOrderArgs } from "@/types/order.type";
import { AxiosError } from "axios";
import useAxios from "../useAxios";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/utils/config";

const useCreateNewOrder = () => {
  const  {axiosInstance} = useAxios()
  const router = useRouter()
  const createNewOrder = async (payload: IOrderArgs) => {
    try {
      const { data } = await axiosInstance.post(
        "/orders/user/new-order",
        payload,
      );
      await new Promise<void>((res)=>setTimeout(res, 500))
      router.push(`order/order-details/${data.order.id}`)
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
