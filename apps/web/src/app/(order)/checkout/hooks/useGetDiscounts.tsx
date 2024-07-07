"use client";
import useGetCartsById from "@/hooks/api/cart/useGetCartById";
import useGetDiscountsByUser from "@/hooks/api/discounts/useGetDiscountsByUser";
import { Discount } from "@/types/discount.type";
import React, { FC, useEffect, useState } from "react";

const useGetDiscounts = (payload: { userId: number }) => {
  const { userId } = payload;
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { carts, isLoading: isLoadingCarts } = useGetCartsById(userId);
  const storeId = carts.length ? carts[0].storeId : undefined;
  const productIds = carts.map((cart) => cart.productId);

  useEffect(() => {
    if (discounts) {
      const { discounts: fetchedDiscounts, isLoading: isLoadingDiscounts } =
        useGetDiscountsByUser({
          storeId,
          productIds,
        });
    }
  });

  useEffect(() => {
    if (!isLoadingCarts) {
    //   setDiscounts(fetchedDiscounts);
      setIsLoading(false);
    }
  }, [isLoadingCarts]);

  return { discounts, isLoading };
};

export default useGetDiscounts;
