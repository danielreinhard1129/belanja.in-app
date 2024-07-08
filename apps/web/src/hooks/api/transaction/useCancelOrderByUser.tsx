import { AxiosError } from "axios";
import { toast } from "sonner";
import useAxios from "../useAxios";

const useCancelOrderByUser = () => {
  const { axiosInstance } = useAxios();

  const cancelOrderByUser = async (orderId: number | undefined) => {
    try {
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/user/cancel-order",
        { orderId },
      );
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };
  return { cancelOrderByUser };
};

export default useCancelOrderByUser;
