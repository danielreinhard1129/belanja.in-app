"use client";

import { axiosInstance } from "@/lib/axios";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetUserNotSuperAdmin = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUserNotSuperAdmin = async () => {
      try {
        const { data } = await axiosInstance.get<User[]>("/users/user");
        setUsers(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error fetching storeAdmins:", error.message);
        }
      }
    };

    getUserNotSuperAdmin();
  }, []);

  return { users };
};

export default useGetUserNotSuperAdmin;
