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
  addressId: number
  deliveryFee: string
  paymentMethod: PaymentMethodArgs
  deliveryService: string
  deliveryCourier: string
}


export enum PaymentMethodArgs{
  DIGITAL_PAYMENT = "DIGITAL_PAYMENT",
  MANUAL_TRANSFER = "MANUAL_TRANSFER"
}