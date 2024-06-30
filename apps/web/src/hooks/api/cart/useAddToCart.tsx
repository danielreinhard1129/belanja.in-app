import React from "react";
import useAxios from "../useAxios";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useAddToCart = () => {
  const { axiosInstance } = useAxios();
  const addToCart = async (
    productId: number | undefined,
    storeId: number | undefined,
  ) => {
    try {
      const { data } = await axiosInstance.post<{ message: string }>(
        "/carts/user/add-to-cart",
        {
          productId,
          storeId,
        },
      );
      toast(data.message)
    } catch (error) {
      if (error instanceof AxiosError) {
        toast(error.message);
      }
    }
  };
  return { addToCart };
};

export default useAddToCart;
