import { AxiosError } from "axios";
import React, { useEffect } from "react";
import useAxios from "../useAxios";
import { toast } from "sonner";

const useCancelOrderByUser = () => {
  const { axiosInstance } = useAxios();

  const cancelOrderByUser = async (orderId: number|undefined) => {
    try {
      // const token =localStorage.getItem("Authorization")
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/user/cancel-order",
        {orderId},
        
      );
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };
  return {cancelOrderByUser};
};

export default useCancelOrderByUser;
