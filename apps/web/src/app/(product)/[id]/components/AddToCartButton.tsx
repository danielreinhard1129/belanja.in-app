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
          className="bg-[#FF6100] px-2 py-3 w-full text-white"
          variant={"outline"}
          disabled={isProductExist}
        >
          {!isProductExist ? (
            <div className="flex gap-4">
              <ShoppingBag size={20} />
              Add to Cart
            </div>
          ) : "Product is in cart"}
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
