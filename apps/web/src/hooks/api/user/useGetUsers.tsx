import { axiosInstance } from "@/lib/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { User } from "@/types/user.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetUsersQuery extends IPaginationQueries {
  search?: string;
  role?: string;
}

const useGetUsers = (queries: IGetUsersQuery) => {
  const [data, setData] = useState<User[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getUsers = async () => {
    try {
      const { data } = await axiosInstance.get("/users", {
        params: queries,
      });

      setData(data.data);
      setMeta(data.meta);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, [queries?.page, queries?.search, queries?.sortOrder, queries?.role]);

  return { data, isLoading, meta, refetch: getUsers };
};

export default useGetUsers;
