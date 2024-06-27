import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { StockJournal } from "@/types/stockJournal.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  status?: string;
}

const useGetStockJournalByStoreAdmin = (queries: IGetStocksQuery) => {
  const { token } = useAppSelector((state) => state.user);
  const [stockJournals, setStockJournals] = useState<StockJournal[] | []>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockJournalByStoreAdmin = async () => {
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
      setStockJournals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStockJournalByStoreAdmin();
  }, [queries?.page, queries?.search, queries?.status]);

  return {
    stockJournals,
    isLoading,
    meta,
    refetch: getStockJournalByStoreAdmin,
  };
};

export default useGetStockJournalByStoreAdmin;
