import { useToast } from "@/components/ui/use-toast";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useUpdateIsReadStockJournalSuperAdmin = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { token } = useAppSelector((state) => state.user);

  const updateIsReadStockJournalSuperAdmin = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.post(
        "/stock-journals/super-admin/update-notifications",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data; // Jika respons membutuhkan pengaksesan data tertentu, sesuaikan di sini
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