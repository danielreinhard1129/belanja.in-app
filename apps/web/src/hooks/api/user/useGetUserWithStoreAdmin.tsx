import { axiosInstance } from "@/libs/axios";
import { User } from "@/types/user.type";
import { useEffect, useState } from "react";

const useGetUser = (id: number) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUser = async () => {
    try {
      const { data } = await axiosInstance.get<User>(`/users/${id}`);
      setUser(data);
    } catch (error) {
      setUser(null);
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
