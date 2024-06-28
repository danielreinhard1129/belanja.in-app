"use client";

import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { Discount } from "@/types/discount.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetDiscountsByStoreAdmin = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const token = localStorage.getItem("Authorization")?.split(" ")[1];
  const getDiscountsByStoreAdmin = async () => {
    try {
      const { data } = await axiosInstance.get<Discount[]>(
        "/discounts/store-admin",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setDiscounts(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching product:", error.message);
      }
      setDiscounts([]);
    }
  };
  useEffect(() => {
    getDiscountsByStoreAdmin();
  }, []);

  return { discounts, refetch: getDiscountsByStoreAdmin };
};

export default useGetDiscountsByStoreAdmin;
