import { toast } from "sonner";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useDeleteStore = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = localStorage.getItem("Authorization")?.split(" ")[1];

  const deleteStore = async (storeId: number) => {
    try {
      setIsLoading(true);
      await axiosInstance.delete(`/stores/${storeId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Store deleted successfully!");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { deleteStore, isLoading };
};

export default useDeleteStore;
