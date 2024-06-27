"use client";

import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { Voucher } from "@/types/voucher.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetVouchersByStoreAdmin = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const { token } = useAppSelector((state) => state.user);
  const getVouchersByStoreAdmin = async () => {
    try {
      const { data } = await axiosInstance.get<Voucher[]>(
        "/discounts/store-admin",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setVouchers(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching product:", error.message);
      }
      setVouchers([]);
    }
  };
  useEffect(() => {
    getVouchersByStoreAdmin();
  }, []);

  return { vouchers, refetch: getVouchersByStoreAdmin };
};

export default useGetVouchersByStoreAdmin;
