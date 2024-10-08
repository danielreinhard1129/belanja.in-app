import { axiosInstance } from "@/libs/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { StockJournal } from "@/types/stockJournal.type";
import { useEffect, useState } from "react";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  status?: string;
  storeId?: string | undefined;
}

const useGetStockJournalsByStoreSuperAdmin = (queries: IGetStocksQuery) => {
  const [stockJournals, setStockJournals] = useState<StockJournal[] | []>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockJournalsByStoreSuperAdmin = async () => {
    try {
      const { data } = await axiosInstance.get("/stock-journals/super-admin", {
        params: queries,
      });
      setStockJournals(data.data);
      setMeta(data.meta);
    } catch (error) {
      setStockJournals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStockJournalsByStoreSuperAdmin();
  }, [queries?.page, queries?.search, queries?.storeId, queries?.status]);

  return {
    stockJournals,
    isLoading,
    meta,
    refetch: getStockJournalsByStoreSuperAdmin,
  };
};

export default useGetStockJournalsByStoreSuperAdmin;
