import { AxiosError } from "axios";
import { toast } from "sonner";
import useAxios from "../useAxios";

const useRemoveItem = () => {
  const { axiosInstance } = useAxios();

  const removeItem = async (cartId: number | undefined) => {
    try {
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/carts/user/remove-item",
        { cartId },
      );
      toast("Item removed");
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.message);
      }
    }
  };
  return { removeItem };
};

export default useRemoveItem;
