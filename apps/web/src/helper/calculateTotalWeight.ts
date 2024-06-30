import { ICart } from "@/types/order.type";

export const calculateTotalWeight = (carts:ICart[])=>{
    return carts.reduce((totalWeight, cart) => {
        return totalWeight + cart.qty * cart.products.weight;
      }, 0);
}