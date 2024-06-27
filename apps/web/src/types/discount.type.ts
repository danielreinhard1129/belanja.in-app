import { Product } from "./product.type";
import { Store } from "./store.type";
import { User } from "./user.type";

export interface Discount {
  id: number;
  title: string;
  desc: string;
  discountType: string;
  discountvalue: number;
  minPurchase: number;
  startDate: string;
  endDate: string;
  storeId: number;
  store: Store;
  productId: number;
  product: Product;
  userDiscount: UserDiscount[];
}

export interface UserDiscount {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isUsed: boolean;
  discountId: number;
  userId: number;
  users: User;
  discount: Discount;
  Order: [];
  OrderItems: [];
}
