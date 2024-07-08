import { axiosInstance } from "@/libs/axios";
import { IPaginationMeta, IPaginationQueries } from "@/types/pagination.type";
import { Stock } from "@/types/stock.type";
import { useEffect, useState } from "react";

interface IGetStocksQuery extends IPaginationQueries {
  search?: string;
  storeId?: string | undefined;
}

const useGetStockByRule = (queries: IGetStocksQuery) => {
  const [stocks, setStocks] = useState<Stock | null>(null);
  const [meta, setMeta] = useState<IPaginationMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockByRule = async () => {
    try {
      const { data } = await axiosInstance.get<Stock>("/store-products", {
        params: queries,
      });
      setStocks(data);
      setMeta(data.storeProducts.meta);
    } catch (error) {
      setStocks(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStockByRule();
  }, [queries?.page, queries?.search, queries?.storeId]);

  return {
    stocks,
    isLoading,
    meta,
    refetch: getStockByRule,
  };
};

export default useGetStockByRule;
