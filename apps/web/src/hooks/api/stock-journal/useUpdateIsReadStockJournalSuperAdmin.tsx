import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/libs/axios";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

const useUpdateIsReadStockJournalSuperAdmin = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateIsReadStockJournalSuperAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/stock-journals/super-admin/update-notifications",
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          description: error?.response?.data?.message || error?.response?.data,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateIsReadStockJournalSuperAdmin, isLoading };
};

export default useUpdateIsReadStockJournalSuperAdmin;
