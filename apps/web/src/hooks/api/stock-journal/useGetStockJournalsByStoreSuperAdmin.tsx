import { axiosInstance } from "@/lib/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { StockJournal } from "@/types/stockJournal.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  status?: string;
  storeId?: string | undefined;
}

const useGetStockJournalsByStoreSuperAdmin = (queries: IGetStocksQuery) => {
  const token = localStorage.getItem("Authorization")?.split(" ")[1];
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
