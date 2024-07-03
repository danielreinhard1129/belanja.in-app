import { AxiosError } from "axios";
import useAxios from "../useAxios";
import { toast } from "sonner";

const useConfirmPayment = () => {
  const { axiosInstance } = useAxios();

  const confirmPayment = async (orderId: number|undefined) => {
    try {
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/admin/confirm-payment",
        {orderId},
        
      );
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };
  return {confirmPayment};
};

export default useConfirmPayment;
