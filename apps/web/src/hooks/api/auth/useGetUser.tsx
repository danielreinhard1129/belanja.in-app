"use client";

import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";
import axiosInstance from "@/libs/axios";

interface UserArgs {
  name: string;
  email: string;
  id: number;
}

const useGetUser = (id: number) => {
  const [user, setUser] = useState<UserArgs | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const { axiosInstance } = useAxios();

  const getUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get<UserArgs>(`/auth/${id}`);

      setUser(data);
      console.log(user);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  return { user, isLoading, refetch: getUser };
};

export default useGetUser;
