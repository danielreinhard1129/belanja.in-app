import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { StockJournal } from "@/types/stockJournal.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  status?: string;
  storeId?: string | undefined;
}

const useGetStockJournalsByStoreWithParams = (queries: IGetStocksQuery) => {
  const token = localStorage.getItem("Authorization")?.split(" ")[1];
  const [stockJournals, setStockJournals] = useState<StockJournal[] | []>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockJournalsByStore = async () => {
    try {
      const { data } = await axiosInstance.get("/stock-journals/filter", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: queries,
      });
      // console.log(data);
      setStockJournals(data.data);
      setMeta(data.meta);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
      setStockJournals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStockJournalsByStore();
  }, [queries?.page, queries?.search, queries?.storeId, queries?.status]);

  return {
    stockJournals,
    isLoading,
    meta,
    refetch: getStockJournalsByStore,
  };
};

export default useGetStockJournalsByStoreWithParams;
