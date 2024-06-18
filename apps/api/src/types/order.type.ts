import { userDiscount } from '@prisma/client';

export interface IProductArg {
  productId: number;
  qty: number;
}

export interface IOrderArgs {
  userId: number;
  storeId: number;
  products: IProductArg[]
  userDiscountIds?: number[];
  userVoucherIds?: number[];
}
