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
}

const useGetSalesReport = (queries: IGetReportsQuery) => {
  const [data, setData] = useState<ChartData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getSalesReport = async () => {
    try {
      const { data } = await axiosInstance.get<ChartData>("/reports/sales", {
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
    getSalesReport();
  }, [queries?.filterMonth, queries?.filterYear, queries?.storeId]);

  return {
    data,
    isLoading,
  };
};

export default useGetSalesReport;
