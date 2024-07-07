import { axiosInstance } from "@/libs/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { StockJournal } from "@/types/stockJournal.type";
import { useEffect, useState } from "react";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  status?: string;
}

const useGetStockMutationByStoreAdmin = (queries: IGetStocksQuery) => {
  const [stockJournals, setStockJournals] = useState<StockJournal[] | []>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockMutationByStoreAdmin = async () => {
    try {
      const { data } = await axiosInstance.get("/stock-journals/store-admin", {
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
    getStockMutationByStoreAdmin();
  }, [queries?.page, queries?.search, queries?.status]);

  return {
    stockJournals,
    isLoading,
    meta,
    refetch: getStockMutationByStoreAdmin,
  };
};

export default useGetStockMutationByStoreAdmin;
