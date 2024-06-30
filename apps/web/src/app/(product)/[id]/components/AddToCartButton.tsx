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

interface AddToCartButtonProps {
  carts: ICart[];
  handleAddToCart: ()=> void;
  productId : number | undefined
}

const AddToCartButton: FC<AddToCartButtonProps> = ({ carts, handleAddToCart, productId }) => {
    const isProductExist = carts.some((cart)=>cart.productId === productId)
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="h-8 bg-orange-200 px-4 py-2 text-orange-600  "
          variant={"outline"}
          disabled={isProductExist}
        >
          {!isProductExist ? "+ Cart" : "Product is in cart"}
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
          <AlertDialogAction className="px-4 py-2" onClick={()=>{handleAddToCart()}}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddToCartButton;
