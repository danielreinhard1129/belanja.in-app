import { axiosInstance } from "@/libs/axios";
import { StockJournal } from "@/types/stockJournal.type";
import { useEffect, useState } from "react";

const useGetStockJournalById = (id: number) => {
  const [journal, setJournal] = useState<StockJournal | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getStockJournalById = async () => {
    try {
      const { data } = await axiosInstance.get<StockJournal>(
        `/stock-journals/${id}`,
      );
      setJournal(data);
    } catch (error) {
      setJournal(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getStockJournalById();
  }, [id]);

  return { journal, isLoading };
};

export default useGetStockJournalById;
