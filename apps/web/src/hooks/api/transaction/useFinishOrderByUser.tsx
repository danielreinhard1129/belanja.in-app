import { AxiosError } from "axios";
import React, { useEffect } from "react";
import useAxios from "../useAxios";
import { toast } from "sonner";

const useFinishOrderByUser = () => {
  const { axiosInstance } = useAxios();

  const finishOrderByUser = async (orderId: number|undefined) => {
    try {
      // const token =localStorage.getItem("Authorization")
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/user/finish-order",
        {orderId},
        
      );
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };
  return {finishOrderByUser};
};

export default useFinishOrderByUser;
