import { useRouter } from "next/navigation";
import useAxios from "../useAxios";
import { useState } from "react";
import { Address } from "@/types/address.type";
import { AxiosError } from "axios";
import { toast } from "sonner";

const useSetPrimaryAddress = (addressId: number, userId: number) => {
  const { axiosInstance } = useAxios();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setPrimaryAddress = async (payload: Pick<Address, "isPrimary">) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.patch(
        `/address/update-address/${addressId}`,
        payload,
      );

      toast.success(response.data.message || "Set primary address success");
      router.push(`/user/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data || "Update Failed");
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { setPrimaryAddress, isLoading };
};

export default useSetPrimaryAddress;
