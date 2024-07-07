export enum DiscountType {
  PRODUCT = 'PRODUCT',
  BOGO = 'BOGO',
  MIN_PURCHASE = 'MIN_PURCHASE',
}

export enum VoucherType {
  PRODUCT = 'PRODUCT',
  DELIVERY = 'DELIVERY',
  PURCHASE = 'PURCHASE',
}

export interface IDiscount {
  id: number;
  title: string;
  desc: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number | null;
  startDate: Date;
  endDate: Date;
  storeId: number;
  productId?: number | null;
  store: IStore;
  product?: IProduct | null;
  userDiscount: IUserDiscount[];
}

export interface IUserDiscount {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  isUsed: boolean;
  discountId: number;
  userId: number;
  users: IUser;
  discounts: IDiscount;
  order: IOrder[];
  orderItems: IOrderItem[];
}

export interface IVoucher {
  id: number;
  code: string;
  description: string;
  voucherType: VoucherType;
  discountValue: number;
  expiredDate: Date;
  productId?: number | null;
  products?: IProduct | null;
  userVoucher: IUserVoucher[];
}

export interface IUserVoucher {
  id: number;
  createdAt: Date;
  isUsed: boolean;
  voucherId: number;
  userId: number;
  vouchers: IVoucher;
}

export interface IStore {
  id: number;
}

export interface IProduct {
  id: number;
}

export interface IUser {
  id: number;
}

export interface IOrder {
  id: number;
}

export interface IOrderItem {
  id: number;
}
