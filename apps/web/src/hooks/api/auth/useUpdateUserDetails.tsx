"use client";

import { axiosInstance } from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileWithPath } from "react-dropzone";
import { toast } from "sonner";

interface UpdateUserForm {
  name: string;
  email: string;
  gender: string;
  birthDate: Date;
  avatarUrl: FileList | null;
}

const useUpdateUserDetails = (userId: number) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.user);

  const updateUserDetails = async (payload: Partial<UpdateUserForm>) => {
    setIsLoading(true);

    try {
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

      const updatedUser: User = {
        ...currentUser,
        ...response.data.data,
      };

      dispatch(setUser(updatedUser));

      toast.success(`${response.data.message}`)

      router.push(`/user/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Axios Error:", error.response?.data || error.message);
      } else {
        console.error("Unknown Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserDetails, isLoading };
};

export default useUpdateUserDetails;
