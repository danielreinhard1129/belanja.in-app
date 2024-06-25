import { Store } from "./store.type";

export interface StockJournal {
  id: number;
  quantity: number;
  type: string;
  productId: number;
  storeId: number;
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
