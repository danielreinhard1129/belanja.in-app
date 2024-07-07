"use client";

import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import useAxios from "../useAxios";
import { User } from "@/types/user.type";

const useGetUser = (id: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { axiosInstance } = useAxios();

  const getUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get<User>(`/auth/${id}`);

      setUser(data);
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
