"use client";

import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { Voucher } from "@/types/voucher.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetVouchersQuery {
  storeId?: string | undefined;
}

const useGetVouchersBySuperAdmin = (queries: IGetVouchersQuery) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const { token } = useAppSelector((state) => state.user);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getVouchersBySuperAdmin = async () => {
    try {
      const { data } = await axiosInstance.get("/vouchers/super-admin", {
        params: queries,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setVouchers(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching product:", error);
      }
      setVouchers([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getVouchersBySuperAdmin();
  }, [queries?.storeId]);

  return { vouchers, isLoading, refetch: getVouchersBySuperAdmin };
};

export default useGetVouchersBySuperAdmin;
