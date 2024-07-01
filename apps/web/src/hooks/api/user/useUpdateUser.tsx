"use client";

import { toast } from "sonner";
import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
import { useState } from "react";

interface UpdateUser {
  name: string;
  email: string;
}

const useUpdateUser = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const updateUser = async (data: UpdateUser, id: number) => {
    setIsLoading(true);
    try {
      const payload = {
        name: data.name,
        email: data.email,
      };

      await axiosInstance.patch(`/users/${id}`, payload);
      toast.success("User has been updated!");
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return { updateUser, isLoading };
};

export default useUpdateUser;
