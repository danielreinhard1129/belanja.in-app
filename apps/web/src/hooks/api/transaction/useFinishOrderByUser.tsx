import { AxiosError } from "axios";
import React, { useEffect } from "react";
import useAxios from "../useAxios";

const useFinishOrderByUser = () => {
  const { axiosInstance } = useAxios();

  const finishOrderByUser = async (orderId: number|undefined) => {
    try {
      // const token =localStorage.getItem("Authorization")
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/user/finish-order",
        {orderId},
        
      );
      alert(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.message);
      }
    }
  };
  return {finishOrderByUser};
};

export default useFinishOrderByUser;
