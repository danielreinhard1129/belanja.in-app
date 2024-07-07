import { Product } from "./product.type";
import { Store } from "./store.type";
import { User } from "./user.type";

export interface Discount {
  id: number;
  title: string;
  desc: string;
  discountType: string;
  discountvalue: number;
  isActive: boolean;
  discountLimit: number;
  minPurchase: number;
  storeId: number;
  store: Store;
  productId: number;
  product: Product;
  userDiscount: UserDiscount[];
  isSelected: boolean
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

export interface IFormDiscount {
  title: string;
  desc: string;
  discountType: string;
  discountvalue?: number;
  discountLimit?: number;
  minPurchase?: number;
  productId?: string;
  storeId?: string;
  isActive?: boolean;
}
