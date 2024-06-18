// useUpdateUserDetails.ts
import { axiosInstance } from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setUser } from "@/redux/slices/userSlice";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface UpdateUserForm {
  name: string;
  email: string;
  gender: string;
  birthDate: Date;
}

const useUpdateUserDetails = (userId: number) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(state => state.user);

  const updateUserDetails = async (payload: Partial<UpdateUserForm>) => {
    setIsLoading(true);

    try {
      const { name, birthDate, email, gender } = payload;
      
      const updatedUser: User = {
        ...currentUser,
        name: name || currentUser.name,
        email: email || currentUser.email,
        gender: gender || currentUser.gender,
        birthDate: birthDate instanceof Date ? birthDate : (birthDate ? new Date(birthDate) : undefined),
        updatedAt: new Date(),
      };

      await axiosInstance.patch(`/auth/update-user-details/${userId}`, updatedUser, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      dispatch(setUser(updatedUser));

      router.push(`/user/${userId}`);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log("Axios Error:", error.response?.data || error.message);
      } else {
        console.log("Unknown Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { updateUserDetails, isLoading };
};

export default useUpdateUserDetails;
