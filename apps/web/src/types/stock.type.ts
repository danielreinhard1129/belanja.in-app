import { IPaginationMeta } from "./pagination.type";
import { StockJournal } from "./stockJournal.type";
import { StoreProduct } from "./storeProduct.type";

interface StockSum {
  storeId: number;
  totalStock: number;
}

export interface Stock {
  storeProducts: {
    data: StoreProduct[];
    meta: IPaginationMeta;
  };
  stockJournals: {
    data: StockJournal[];
    meta: IPaginationMeta;
  };
  stockSum: StockSum[];
}
