"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useGetCartsById from "@/hooks/api/cart/useGetCartById";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import AlertDialogRemoveItem from "./components/AlertDialogRemoveItem";
import { set } from "lodash";
import useIncrementCart from "@/hooks/api/cart/useIncrementCart";
import useDecrementCart from "@/hooks/api/cart/useDecrementCart";
import useRemoveItem from "@/hooks/api/cart/useRemoveItem";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthGuardTrx from "@/hoc/AuthGuardTrx";
import { setCartCounterAction } from "@/redux/slices/userSlice";

const Cart = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { id: userId } = useAppSelector((state) => state.user);
  const {
    carts,
    isLoading,
    setCarts,
    cartsCount,
    refetch: refetchCart,
  } = useGetCartsById(userId);
  const [isLoadingIndex, setIsLoadingIndex] = useState<number | null>(null);
  const { incrementCart } = useIncrementCart();
  const { decrementCart } = useDecrementCart();
  const { removeItem } = useRemoveItem();
  const baseURL = process.env.NEXT_PUBLIC_BASE_API_URL;


  const handleRemoveItem = async (index: number, id: number) => {
    setIsLoadingIndex(index);
    await removeItem(id);
    setIsLoadingIndex(null);
    await refetchCart();
    dispatch(setCartCounterAction({ cartCounter: cartsCount - 1 }));

  };

  const handleIncrement = async (index: number, id: number) => {
    setIsLoadingIndex(index);
    await incrementCart(id);
    setIsLoadingIndex(null);
    refetchCart();
  };

  const handleDecrement = async (index: number, id: number) => {
    setIsLoadingIndex(index);
    await decrementCart(id);
    setIsLoadingIndex(null);
    refetchCart();
  };
  
  if (!carts || !carts.length) {
    return (
      <div className="container mx-auto flex h-screen flex-col items-center justify-center gap-y-2 text-2xl font-semibold">
        <p>Oops, Sorry. It seems you have no item selected.</p>
        <Link href="/">
          <p className="text-lg text-orange-300 underline">Start shopping?</p>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 z-0 relative h-fit pb-16 mt-16">
      {carts.map((cart, index) => {
        return (
          cart.isActive && (
            <div key={index} className={`mb-4 ${!cart.qty ? "" : ""} `}>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-sm border">
                  <Image
                    alt="Product"
                    fill
                    src={`${baseURL}/assets${cart.products.images[0].images}`}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="line-clamp-1 overflow-hidden">
                    {cart.products.name}
                  </p>
                  <p className="text-xs font-light">{cart.products.weight}gr</p>
                  <p className="text-md font-bold">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      maximumSignificantDigits: Math.trunc(
                        Math.abs(cart.products.price),
                      ).toFixed().length,
                    }).format(cart.products.price)}
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <div className="flex items-center rounded-md shadow-sm">
                  <AlertDialogRemoveItem
                    index={index}
                    isLoadingIndex={isLoadingIndex}
                    cartId={cart.id}
                    handleRemoveItem={handleRemoveItem}
                  />

                  <Button
                    className="rounded-l-md rounded-r-none px-2 py-1"
                    onClick={() => handleDecrement(index, cart.id)}
                    disabled={
                      index === isLoadingIndex ||
                      cart.qty === 1 ||
                      cart.qty === 0
                    }
                  >
                    -
                  </Button>

                  <div className="flex h-full w-8 items-center justify-center shadow-inner">
                    {cart.qty}
                  </div>
                  <Button
                    className="rounded-l-none rounded-r-md px-2 py-1"
                    onClick={() => handleIncrement(index, cart.id)}
                    disabled={index === isLoadingIndex}
                  >
                    +
                  </Button>
                </div>
              </div>
              {index !== carts.length - 1 ? (
                <Separator className="mt-4" />
              ) : null}
            </div>
          )
        );
      })}
      
    </div>
  );
};

export default AuthGuardTrx(Cart);
