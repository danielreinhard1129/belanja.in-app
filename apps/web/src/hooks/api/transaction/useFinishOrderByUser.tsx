import { AxiosError } from "axios";
import { toast } from "sonner";
import useAxios from "../useAxios";

const useFinishOrderByUser = () => {
  const { axiosInstance } = useAxios();

  const finishOrderByUser = async (orderId: number | undefined) => {
    try {
      const { data } = await axiosInstance.patch<{ message: string }>(
        "/orders/user/finish-order",
        { orderId },
      );
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.message);
      }
    }
  };
  return { finishOrderByUser };
};

export default useFinishOrderByUser;
