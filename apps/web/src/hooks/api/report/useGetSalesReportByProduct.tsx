import { axiosInstance } from "@/libs/axios";
import { useEffect, useState } from "react";

interface ChartData {
  data: {
    totalIncome: number;
    totalTransaction: number;
    incomeMonthly: number[];
    transactionMonthly: number[];
    incomeDaily: number[];
    transactionDaily: number[];
  };
}

interface IGetReportsQuery {
  filterMonth: string;
  filterYear: string;
  storeId?: string;
  productId?: string;
}

const useGetSalesReportByProduct = (queries: IGetReportsQuery) => {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSalesReportByProduct = async () => {
    try {
      const { data } = await axiosInstance.get<ChartData>("/reports/product", {
        params: queries,
      });
      setData(data);
    } catch (error) {
      setData(null);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSalesReportByProduct();
  }, [
    queries?.filterMonth,
    queries?.filterYear,
    queries?.storeId,
    queries?.productId,
  ]);

  return {
    data,
    isLoading,
  };
};

export default useGetSalesReportByProduct;
