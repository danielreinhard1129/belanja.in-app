"use client";

import { axiosInstance } from "@/lib/axios";
import { loginAction } from "@/redux/slices/userSlice";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

interface LoginResponses {
  message: string;
  data: User;
  token: string;
}

interface LoginArgs extends Pick<User, "email" | "password" | "role"> {}

const useLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const login = async (payload: LoginArgs) => {
    try {
      const { data } = await axiosInstance.post<LoginResponses>(
        "/auth/login",
        payload,
      );

      dispatch(loginAction({ user: data.data, token: data.token }));
      localStorage.setItem("Authorization", `Bearer ${data.token}`);
      if (data.data.role === "USER") {
        router.push("/");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error);
      }
    }
  };
  return { login };
};

export default useLogin;
