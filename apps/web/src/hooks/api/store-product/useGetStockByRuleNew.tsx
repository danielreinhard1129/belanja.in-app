import { axiosInstance } from "@/lib/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { Stock } from "@/types/stock.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  storeId?: string | undefined;
}

const useGetStockByRuleNew = (queries: IGetStocksQuery) => {
  const token = localStorage.getItem("Authorization")?.split(" ")[1];
  const [stocks, setStocks] = useState<Stock | null>(null);
  const [metaStock, setMetaStock] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
  }, [queries?.page, queries?.search, queries?.storeId]);

  return {
    stocks,
    isLoading,
    metaStock,
    // metaStockJournal,
    refetch: getStockByRuleNew,
  };
};

export default useGetStockByRuleNew;
