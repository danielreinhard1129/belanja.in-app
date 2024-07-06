import { useEffect, useState } from "react";
import useAxios from "../useAxios";
import { AxiosError } from "axios";

interface IGetReportsQuery {
  productId?: string;
  storeId?: string;
}

interface Image {
  id: number;
  images: string;
  productId: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  weight: number;
  price: number;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  images: Image[];
  orderCount: number;
}

interface ProductResponse {
  data: Product[];
}

const useGetMostBuyProducts = (queries: IGetReportsQuery) => {
  const [data, setData] = useState<ProductResponse>();
  const [isLoading, setIsLoading] = useState<Boolean>(true);
  const { axiosInstance } = useAxios();

  const getProducts = async () => {
    try {
      const { data } = await axiosInstance.get<ProductResponse>(
        "/reports/most-buy",
        {
          params: queries,
        },
      );

      setData(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [queries?.storeId, queries.productId]);
  return { data, isLoading };
};

export default useGetMostBuyProducts;
