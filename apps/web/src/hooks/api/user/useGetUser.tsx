"use client";

import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetUser = (id: number) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await axiosInstance.get<User>(`/users/${id}`);
        setUser(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error fetching product:", error.message);
        }
      }
    };

    getUser();
  }, [id]);

  return { user };
};

export default useGetUser;
