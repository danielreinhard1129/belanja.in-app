import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Stock } from "@/types/stock.type";
import { axiosInstance } from "@/lib/axios";
import { useAppSelector } from "@/redux/hooks";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  storeId?: string | undefined;
}

const useGetStockByRuleNew = (queries: IGetStocksQuery) => {
  const [stocks, setStocks] = useState<Stock | null>(null);
  const [metaStock, setMetaStock] = useState<IPaginationMeta | null>(null);
  const [metaStockJournal, setMetaStockJournal] =
    useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { token } = useAppSelector((state) => state.user);

  const getStockByRuleNew = async () => {
    try {
      const { data } = await axiosInstance.get<Stock>("/store-products", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        params: queries,
      });
      setStocks(data);
      setMetaStock(data.storeProducts.meta);
      setMetaStockJournal(data.stockJournals.meta);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStockByRuleNew();
  }, [
    queries?.page,
    queries?.stockJournalsPage,
    queries?.search,
    queries?.storeId,
  ]);

  return {
    stocks,
    isLoading,
    metaStock,
    metaStockJournal,
    refetch: getStockByRuleNew,
  };
};

export default useGetStockByRuleNew;
