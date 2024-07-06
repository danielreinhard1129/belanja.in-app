import { axiosInstance } from "@/lib/axios";
import { Store } from "@/types/store.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetStoreById = (id: number) => {
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStoreById = async () => {
    try {
      const { data } = await axiosInstance.get<Store>(`/stores/${id}`);
      setStore(data);
    } catch (error) {
      setStore(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStoreById();
  }, [id]);

  return { store, isLoading, refetch: getStoreById };
};

export default useGetStoreById;
