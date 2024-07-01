import { AxiosError } from 'axios';
import React from 'react'
import useAxios from '../useAxios';
import { toast } from 'sonner';

const useRemoveItem = () => {
  const { axiosInstance } = useAxios();

    const removeItem = async (cartId: number|undefined) => {
        try {
          // const token =localStorage.getItem("Authorization")
          const { data } = await axiosInstance.patch<{ message: string }>(
            "/carts/user/remove-item",
            {cartId},
            // {
            //   headers: {
            //     Authorization: token,
            //   },
            // },
          );
          toast(data.message);
        } catch (error) {
          if (error instanceof AxiosError) {
            alert(error.message);
          }
        }
      };
      return {removeItem};
}

export default useRemoveItem