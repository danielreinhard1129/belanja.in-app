import { Product } from "./product.type";
import { Store } from "./store.type";

export interface StockJournal {
  id: number;
  quantity: number;
  type: string;
  status: string;
  productId: number;
  product: Product;
  storeId: number;
  store: Store;
  fromStoreId: number | null;
  toStoreId: number | null;
  createdAt: string;
  JournalDetail: JournalDetail[];
}

export interface JournalDetail {
  id: number;
  stockJournalId: number;
  toStoreId: number | null;
  toStore: Store;
}
