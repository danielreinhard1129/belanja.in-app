"use client";

import { useState } from "react";
import { googleLogout } from "@react-oauth/google";
import { axiosInstance } from "@/lib/axios";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

interface User {
  name: string;
  email: string;
}

const useGoogleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const login = async (email: string, name: string) => {
    try {
      await axiosInstance.post("/auth/login/google", { email, name });
      router.push("/");
    } catch (error) {
      alert(error);
    }
  };

  const handleLoginSuccess = (credentialResponse: any) => {
    const decoded = jwtDecode(credentialResponse.credential as string) as User;
    login(decoded.email, decoded.name);
  };

  const logout = () => {
    googleLogout();
    setUser(null);
  };

  return { logout, handleLoginSuccess };
};

export default useGoogleAuth;
