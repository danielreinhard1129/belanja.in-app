import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";
import { StockJournal } from "@/types/stockJournal.type";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  status?: string;
  storeId?: string | undefined;
}

const useGetStockJournalsByStoreSuperAdmin = (queries: IGetStocksQuery) => {
  const { token } = useAppSelector((state) => state.user);
  const [stockJournals, setStockJournals] = useState<StockJournal[] | []>([]);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockJournalsByStoreSuperAdmin = async () => {
    try {
      const { data } = await axiosInstance.get("/stock-journals/super-admin", {
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
