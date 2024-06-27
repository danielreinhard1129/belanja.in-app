"use client";

import { axiosInstance } from "@/lib/axios";
import { Discount } from "@/types/discount.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetDiscount = (id: number) => {
  const [discount, setDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    const getDiscount = async () => {
      try {
        const { data } = await axiosInstance.get<Discount>(`/discounts/${id}`);
        setDiscount(data);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error fetching product:", error.message);
        }
      }
    };

    getDiscount();
  }, [id]);

  return { discount };
};

export default useGetDiscount;
