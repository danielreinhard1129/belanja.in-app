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
  isActive: boolean;
}

export interface IFormStoreProduct {
  storeId: string;
  stocks: {
    productId: string;
    qty: number;
  }[];
}

export interface IFormRequestStoreProduct {
  storeId: string;
  type: string;
  stocks: {
    productId: string;
    qty: number;
  }[];
}
