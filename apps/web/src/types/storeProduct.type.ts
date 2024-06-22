import { Product } from "./product.type";
import { Store } from "./store.type";

export interface StoreProduct {
  id: number;
  qty: number;
  createdAt: string;
  updatedAt: string;
  storeId: number;
  productId: number;
  store: Store;
  product: Product;
  total: number;
}
