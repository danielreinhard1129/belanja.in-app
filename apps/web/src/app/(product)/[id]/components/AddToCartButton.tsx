"use client";

import React, { FC } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ICart, IOrder, OrderStatus } from "@/types/order.type";
import { ShoppingBag } from "lucide-react";
import { useAppSelector } from "@/redux/hooks";

interface AddToCartButtonProps {
  carts: ICart[];
  handleAddToCart: () => void;
  productId: number | undefined;
  stock: number;
}

const AddToCartButton: FC<AddToCartButtonProps> = ({
  carts,
  handleAddToCart,
  productId,
  stock,
}) => {
  const isProductExist = carts.some((cart) => cart.productId === productId);
  const { id } = useAppSelector((state) => state.user);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="w-full bg-[#FF6100] px-2 py-3 text-white"
          variant={"outline"}
          disabled={isProductExist || id === 0 || stock === 0}
        >
          {!isProductExist ? (
            <div className="flex gap-4">
              <ShoppingBag size={20} />
              Add to Cart
            </div>
          ) : (
            "Product is in cart"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add to cart?</AlertDialogTitle>
          <AlertDialogDescription>
            {/* This action cannot be undone. MAKE SURE YOU HAVE CORRECTLY RECEIVED THE ITEMS YOU ORDERED. */}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="px-4 py-2">No</AlertDialogCancel>
          <AlertDialogAction
            className="px-4 py-2"
            onClick={() => {
              handleAddToCart();
            }}
          >
            Yes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddToCartButton;
