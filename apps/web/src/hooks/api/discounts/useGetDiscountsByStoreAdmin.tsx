"use client";

import { axiosInstance } from "@/libs/axios";
import { Discount } from "@/types/discount.type";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { useEffect, useState } from "react";

interface IGetDiscountsQuery extends IPaginationQueries {
  discountType?: string;
}

const useGetDiscountsByStoreAdmin = (queries: IGetDiscountsQuery) => {
  const [data, setData] = useState<Discount[]>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getDiscountsByStoreAdmin = async () => {
    try {
      const { data } = await axiosInstance.get("/discounts/store-admin", {
        params: queries,
      });
      setData(data.data);
      setMeta(data.meta);
    } catch (error) {
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getDiscountsByStoreAdmin();
  }, [queries?.discountType, queries?.page, queries?.sortOrder]);

  return { data, isLoading, meta, refetch: getDiscountsByStoreAdmin };
};

export default useGetDiscountsByStoreAdmin;
