"use client";

import { StoreProduct } from "@/types/storeProduct.type";
import { Store } from "@/types/store.type";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetStockByRule = (role: string, storeAdminId: number) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>([]);

  useEffect(() => {
    const getStocks = async () => {
      try {
        if (role === "SUPERADMIN") {
          const { data } = await axios.get<Store[]>(
            "http://localhost:8000/api/stores",
          );
          setStores(data);
        } else {
          const { data } = await axios.get<StoreProduct[]>(
            "http://localhost:8000/api/store-products/by-super-admin",
            {
              params: { storeAdminId },
            },
          );
          setStoreProducts(data);
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error("Error fetching categories:", error.message);
        }
      }
    };

    getStocks();
  }, [role, storeAdminId]);

  const getStocksByStore = async (storeId: number) => {
    try {
      const { data } = await axios.get<StoreProduct[]>(
        "http://localhost:8000/api/store-products/by-store",
        {
          params: { storeId },
        },
      );
      setStoreProducts(data);
    } catch (error) {
      console.error("Error fetching stocks by store:", error);
    }
  };

  return { storeProducts, stores, getStocksByStore, refetch: getStocksByStore };
};

export default useGetStockByRule;
