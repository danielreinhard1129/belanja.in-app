import { axiosInstance } from "@/libs/axios";
import { SalesReportResponse } from "@/types/reports.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetReportsQuery {
  filterDate?: Date;
  storeId?: string;
  productId?: string;
  categoryId?: string;
}

const useGetReports = (queries: IGetReportsQuery) => {
  const [data, setData] = useState<SalesReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getReports = async () => {
    try {
      const { data } = await axiosInstance.get<SalesReportResponse>(
        "/orders/reports/sales",
        {
          params: queries,
        },
      );
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
    getReports();
  }, [
    queries?.filterDate,
    queries?.storeId,
    queries?.productId,
    queries?.categoryId,
  ]);

  return {
    data,
    isLoading,
  };
};

export default useGetReports;
