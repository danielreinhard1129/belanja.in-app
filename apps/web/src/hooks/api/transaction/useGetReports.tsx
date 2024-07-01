import { axiosInstance } from "@/libs/axios";
import { OrderReportResponse } from "@/types/reports.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetReportsQuery {
  year?: string;
}

const useGetReports = (queries: IGetReportsQuery) => {
  const [data, setData] = useState<OrderReportResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getReports = async () => {
    try {
      const { data } = await axiosInstance.get<OrderReportResponse>(
        "/orders/reports",
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
  }, [queries?.year]);

  return {
    data,
    isLoading,
  };
};

export default useGetReports;
