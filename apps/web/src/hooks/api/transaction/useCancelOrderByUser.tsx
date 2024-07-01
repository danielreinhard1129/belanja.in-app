import { AxiosError } from "axios";
import React, { useEffect } from "react";
import useAxios from "../useAxios";

const useCancelOrderByUser = () => {
  const { axiosInstance } = useAxios();

  const cancelOrderByUser = async (orderId: number|undefined) => {
    try {
      // const token =localStorage.getItem("Authorization")
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/user/cancel-order",
        {orderId},
        
      );
      alert(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.message);
      }
    }
  };
  return {cancelOrderByUser};
};

export default useCancelOrderByUser;
