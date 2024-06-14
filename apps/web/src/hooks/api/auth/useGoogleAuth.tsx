"use client";

import { googleLogout } from "@react-oauth/google";
import { axiosInstance } from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { loginAction, logoutAction } from "@/redux/slices/userSlice";

interface User {
  name: string;
  email: string;
  picture: string;
}

const useGoogleAuth = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const googleLogin = async (
    email: string,
    name: string,
    avatarUrl: string,
  ) => {
    try {
      const { data } = await axiosInstance.post("/auth/login/google", {
        email,
        name,
        avatarUrl,
      });

      dispatch(loginAction({ user: data.data, token: data.token }));
      localStorage.setItem("Authorization", `Bearer ${data.token}`);
      if (data.data.role === "USER") {
        router.push("/");
      }
    } catch (error) {
      alert(error);
    }
  };

  const handleLoginSuccess = (credentialResponse: any) => {
    const decoded = jwtDecode(credentialResponse.credential as string) as User;
    googleLogin(decoded.email, decoded.name, decoded.picture);
  };

  const logout = () => {
    googleLogout();
    localStorage.removeItem("token");
    dispatch(logoutAction());
    router.push("/");
  };

  return { logout, handleLoginSuccess, googleLogin };
};

export default useGoogleAuth;
