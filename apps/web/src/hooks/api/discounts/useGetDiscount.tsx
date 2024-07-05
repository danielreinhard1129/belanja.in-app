import { axiosInstance } from "@/lib/axios";
import { Discount } from "@/types/discount.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetDiscount = (id: number) => {
  const [discount, setDiscount] = useState<Discount | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getDiscount = async () => {
    try {
      const { data } = await axiosInstance.get<Discount>(`/discounts/${id}`);
      setDiscount(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getDiscount();
  }, [id]);

  return { discount, isLoading, refetch: getDiscount };
};

export default useGetDiscount;
