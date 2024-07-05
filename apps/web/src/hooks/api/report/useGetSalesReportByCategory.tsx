import { axiosInstance } from "@/libs/axios";
import { AxiosError } from "axios";
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
  categoryId?: string;
}

const useGetSalesReportByCategory = (queries: IGetReportsQuery) => {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSalesReportByCategory = async () => {
    try {
      const { data } = await axiosInstance.get<ChartData>("/reports/category", {
        params: queries,
      });
      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSalesReportByCategory();
  }, [
    queries?.filterMonth,
    queries?.filterYear,
    queries?.storeId,
    queries?.categoryId,
  ]);

  return {
    data,
    isLoading,
  };
};

export default useGetSalesReportByCategory;
