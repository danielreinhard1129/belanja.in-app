import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useDeleteStore = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.user);

  const deleteStore = async (storeId: number) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/stores/${storeId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast({
        description: "Store deleted successfully!",
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        // toast({
        //   description: error?.response?.data?.message || error?.response?.data,
        // });
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteStore, isLoading };
};

export default useDeleteStore;
