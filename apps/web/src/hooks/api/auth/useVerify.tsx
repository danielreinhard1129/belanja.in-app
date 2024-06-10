import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IVerifyResponse {
  message: string;
}

interface VerifyArgs extends Pick<User, "password"> {}

const useVerify = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const verify = async (password: VerifyArgs, token: string) => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.patch<IVerifyResponse>(
        "/auth/verify",
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log(data.message);

      router.replace("/login");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        console.log(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { verify, isLoading };
};

export default useVerify;
