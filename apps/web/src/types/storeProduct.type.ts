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
}

export interface IFormStoreProduct {
  storeId: string;
  // fromStoreId?: string;
  stocks: {
    productId: string;
    qty: number;
  }[];
}

export interface IFormRequestStoreProduct {
  storeId: string;
  // fromStoreId?: string;
  type: string;
  stocks: {
    productId: string;
    qty: number;
  }[];
}
