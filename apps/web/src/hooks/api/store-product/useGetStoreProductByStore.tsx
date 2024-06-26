// "use client";

// import { axiosInstance } from "@/lib/axios";
// import { Product } from "@/types/product.type";
// import axios, { AxiosError } from "axios";
// import { useEffect, useState } from "react";

// const useGetStoreProductByStore = (id: number) => {
//   const [products, setProducts] = useState<Product[] | []>([]);

//   useEffect(() => {
//     const getStoreProductByStore = async () => {
//       try {
//         const { data } = await axiosInstance.get<Product[]>(
//           `/store-products/${id}`,
//         );
//         console.log(data);
//         setProducts(data);
//       } catch (error) {
//         if (error instanceof AxiosError) {
//           console.error("Error fetching product:", error.message);
//         }
//       }
//     };

//     getStoreProductByStore();
//   }, [id]);

//   return { products };
// };

// export default useGetStoreProductByStore;

"use client";

import { axiosInstance } from "@/lib/axios";
import { Product } from "@/types/product.type";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const useGetProductsByStore = (id: number) => {
  const [products, setProducts] = useState<Product[]>([]);
  const getProducts = async () => {
    try {
      const { data } = await axiosInstance.get<Product[]>(
        `/store-products/${id}`,
      );
      setProducts(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Error fetching product:", error.message);
      }
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  return { products, refetch: getProducts };
};

export default useGetProductsByStore;
