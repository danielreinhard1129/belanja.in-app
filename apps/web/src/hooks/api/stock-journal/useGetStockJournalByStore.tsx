import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Stock } from "@/types/stock.type";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { StockJournal } from "@/types/stockJournal.type";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
}

const useGetStockJournalByStore = (queries: IGetStocksQuery) => {
  const { token } = useAppSelector((state) => state.user);
  const [stockJournals, setStockJournals] = useState<StockJournal[] | []>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockJournalByStore = async () => {
    try {
      const { data } = await axiosInstance.get("/stock-journals", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: queries,
      });
      setStockJournals(data.data);
      setMeta(data.meta);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStockJournalByStore();
  }, [queries?.page, queries?.search]);

  return {
    stockJournals,
    isLoading,
    meta,
    refetch: getStockJournalByStore,
  };
};

export default useGetStockJournalByStore;
