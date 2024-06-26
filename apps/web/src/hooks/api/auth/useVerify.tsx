import { axiosInstance } from "@/lib/axios";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface IVerifyResponse {
  message: string;
}

const useVerify = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const verify = async (password: string, token: string) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.patch<IVerifyResponse>(
        "/auth/verify",
        { password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast.success(data.message);

      router.replace("/login");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { verify, isLoading };
};

export default useVerify;
