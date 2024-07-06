import { axiosInstance } from "@/libs/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { StockJournal } from "@/types/stockJournal.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  status?: string;
  filterMonth: string;
  filterYear: string;
  storeId?: string | undefined;
}

const useGetStockJournalsByStoreWithParams = (queries: IGetStocksQuery) => {
  const [stockJournals, setStockJournals] = useState<StockJournal[] | []>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockJournalsByStore = async () => {
    try {
      const { data } = await axiosInstance.get("/stock-journals/filters", {
        params: queries,
      });
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
  }, [
    queries?.page,
    queries?.search,
    queries?.storeId,
    queries?.status,
    queries?.filterMonth,
    queries?.filterYear,
  ]);

  return {
    stockJournals,
    isLoading,
    meta,
    refetch: getStockJournalsByStore,
  };
};

export default useGetStockJournalsByStoreWithParams;
