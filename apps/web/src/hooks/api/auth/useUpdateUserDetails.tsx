"use client";

import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileWithPath } from "react-dropzone";
import { toast } from "sonner";
import useAxios from "../useAxios";

interface UpdateUserForm {
  name: string;
  email: string;
  gender: string;
  birthDate: Date;
  avatarUrl: FileList | null;
}

const useUpdateUserDetails = (userId: number) => {
  const { axiosInstance } = useAxios();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const updateUserDetails = async (payload: Partial<UpdateUserForm>) => {
    try {
      setIsLoading(true);
      const { name, birthDate, email, gender, avatarUrl } = payload;

      const userUpdateForm = new FormData();

      if (name) userUpdateForm.append("name", name);
      if (email) userUpdateForm.append("email", email);
      if (gender) userUpdateForm.append("gender", gender);
      if (birthDate)
        userUpdateForm.append("birthDate", birthDate.toISOString());
      if (avatarUrl)
        Array.from(avatarUrl).forEach((file: FileWithPath) => {
          userUpdateForm.append("avatarUrl", file);
        });

      const response = await axiosInstance.patch(
        `/auth/update-user-details/${userId}`,
        userUpdateForm,
      );

      toast.success(`${response.data.message}`);

      router.push(`/user/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(`Error: ${error.response?.data}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserDetails, isLoading };
};

export default useUpdateUserDetails;
