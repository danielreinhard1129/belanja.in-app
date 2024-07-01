// "use client";

// import { axiosInstance } from "@/lib/axios";
// import { useAppSelector } from "@/redux/hooks";
// import { Discount } from "@/types/discount.type";
// import { AxiosError } from "axios";
// import { useEffect, useState } from "react";

// const useGetDiscountsByStoreAdmin = () => {
//   const [discounts, setDiscounts] = useState<Discount[]>([]);
//   const { token } = useAppSelector((state) => state.user);
//   const getDiscountsByStoreAdmin = async () => {
//     try {
//       const { data } = await axiosInstance.get<Discount[]>(
//         "/discounts/store-admin",
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );
//       setDiscounts(data);
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         console.error("Error fetching product:", error.message);
//       }
//       setDiscounts([]);
//     }
//   };
//   useEffect(() => {
//     getDiscountsByStoreAdmin();
//   }, []);

//   return { discounts, refetch: getDiscountsByStoreAdmin };
// };

// export default useGetDiscountsByStoreAdmin;

"use client";

import { axiosInstance } from "@/libs/axios";
import { Discount } from "@/types/discount.type";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { AxiosError } from "axios";
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
      if (error instanceof AxiosError) {
        console.error("Error fetching product:", error);
      }
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
