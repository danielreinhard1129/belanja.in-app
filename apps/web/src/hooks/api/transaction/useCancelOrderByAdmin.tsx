import { AxiosError } from "axios";
import useAxios from "../useAxios";
import { toast } from "sonner";

const useCancelOrderByAdmin = () => {
  const { axiosInstance } = useAxios();

  const cancelOrderByAdmin = async (orderId: number|undefined) => {
    try {
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/admin/cancel-order",
        {orderId},
        
      );
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };
  return {cancelOrderByAdmin};
};

export default useCancelOrderByAdmin;
