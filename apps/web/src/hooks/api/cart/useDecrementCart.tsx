import { AxiosError } from 'axios';
import useAxios from '../useAxios';

const useDecrementCart = () => {
  const { axiosInstance } = useAxios();

    const decrementCart = async (cartId: number|undefined) => {
        try {
          // const token =localStorage.getItem("Authorization")
          const { data } = await axiosInstance.patch<{ message: string }>(
            "/carts/user/decrement-cart",
            {cartId},
            // {
            //   headers: {
            //     Authorization: token,
            //   },
            // },
          );
          // alert(data.message);
        } catch (error) {
          if (error instanceof AxiosError) {
            alert(error.message);
          }
        }
      };
      return {decrementCart};
}

export default useDecrementCart