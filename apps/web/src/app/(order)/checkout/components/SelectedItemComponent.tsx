import { Button } from "@/components/ui/button";
import { ICart } from "@/types/order.type";
import Image from "next/image";
import React, { FC, useEffect } from "react";

interface SelectedItemsProps {
  index: number;
  url: string | undefined;
  cart: ICart;
  carts: ICart[];
  counter: (carts: ICart[]) => void;
  userId: number;
}

const SelectedItemComponent: FC<SelectedItemsProps> = ({
  index,
  url,
  cart,
  counter,
  carts,
  userId,
}) => {

  const handleIncreaseCounter = (index: number) => {
    counter(
      carts.map((cart, idx) => {
        if (idx === index) {
          return { ...cart, qty: cart.qty + 1 };
        }
        return cart;
      }),
    );
  };
  const handleDecreaseCounter = (index: number) => {
    counter(
      carts.map((cart, idx) => {
        if (idx === index) {
          return { ...cart, qty: cart.qty > 0 ? cart.qty - 1 : 0 }; // Prevent qty from going below 0
        }
        return cart;
      }),
    );
  };
  // console.log("ini carts dari FE",carts);
  
  // useEffect(() => {
  //   setTimeout(() => updateCart({ userId, carts: carts }), 5000);
  // }, [carts]);
  return (
    <div key={index} className="mb-4">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-sm border">
          <Image
            alt="Product"
            fill
            src={`${url}/assets${cart.products.images[0].images}`}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="line-clamp-1 overflow-hidden">{cart.products.name}</p>
          <p className="text-xs font-light">{cart.products.weight}gr</p>
          <p className="text-md font-bold">
           {cart.qty} X {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              maximumSignificantDigits: Math.trunc(
                Math.abs(cart.products.price),
              ).toFixed().length,
            }).format(cart.products.price)}
          </p>
        </div>
      </div>
      
    </div>
  );
};

export default SelectedItemComponent;
