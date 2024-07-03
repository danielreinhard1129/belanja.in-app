import { useState } from "react";
import useAxios from "../useAxios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { Address } from "@/types/address.type";

const useUpdateAddress = (addressId: number, userId: number) => {
  const { axiosInstance } = useAxios();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateAddress = async (payload: Partial<Address>) => {
    try {
      const response = await axiosInstance.patch(
        `/address/update-address/${addressId}`,
        payload,
      );

      toast.success(response.data.message);
      router.push(`/user/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.message || "Update failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { updateAddress, isLoading };
};

export default useUpdateAddress;
