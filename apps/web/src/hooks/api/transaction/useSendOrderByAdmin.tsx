import { AxiosError } from "axios";
import useAxios from "../useAxios";
import { toast } from "sonner";

const useSendOrderByAdmin = () => {
  const { axiosInstance } = useAxios();

  const sendOrderByAdmin = async (orderId: number | undefined) => {
    try {
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/admin/send-order",
        { orderId },
      );
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };
  return { sendOrderByAdmin };
};

export default useSendOrderByAdmin;
