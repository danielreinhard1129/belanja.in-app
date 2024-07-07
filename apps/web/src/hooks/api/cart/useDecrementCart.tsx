import { AxiosError } from "axios";
import useAxios from "../useAxios";

const useDecrementCart = () => {
  const { axiosInstance } = useAxios();

  const decrementCart = async (cartId: number | undefined) => {
    try {
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/carts/user/decrement-cart",
        { cartId },
      );
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.message);
      }
    }
  };
  return { decrementCart };
};

export default useDecrementCart;
