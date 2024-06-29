import { AxiosError } from 'axios';
import React from 'react'
import useAxios from '../useAxios';

const useIncrementCart = () => {
  const { axiosInstance } = useAxios();

    const incrementCart = async (cartId: number|undefined) => {
        try {
          // const token =localStorage.getItem("Authorization")
          const { data } = await axiosInstance.patch<{ message: string }>(
            "/carts/user/increment-cart",
            {cartId},
            // {
            //   headers: {
            //     Authorization: token,
            //   },
            // },
          );
        //   alert(data.message);
        } catch (error) {
          if (error instanceof AxiosError) {
            alert(error.message);
          }
        }
      };
      return {incrementCart};
}

export default useIncrementCart