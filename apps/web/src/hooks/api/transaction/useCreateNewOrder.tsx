"use client";
import { IOrderArgs } from "@/types/order.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import useAxios from "../useAxios";
import { toast } from "sonner";

const useCreateNewOrder = () => {
  const { axiosInstance } = useAxios();
  const router = useRouter();
  const createNewOrder = async (payload: IOrderArgs) => {
    try {
      const location = localStorage.getItem("location");
      if (!location) {
        toast.error("Location access not given, not allowed to checkout")
        return
      }
      const { data } = await axiosInstance.post(
        "/orders/user/new-order",
        payload,
      );
      console.log("dari useCreateOrder", payload);

      await new Promise<void>((res) => setTimeout(res, 500));
      router.push(`/order-details/${data.order.id}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        // toast.error({
        //   description: error?.response?.data,
        // });
      }
    }
  };
  return { createNewOrder };
};

export default useCreateNewOrder;
