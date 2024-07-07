import { Address } from "./address.type";
import { Delivery } from "./delivery.type";
import { Product } from "./product.type";
import { Store } from "./store.type";
import { User } from "./user.type";

export interface IProductArg {
  productId: number;
  qty: number;
}

export interface IOrderArgs {
  userId: number;
  storeId: number;
  products: IProductArg[];
  discountIds?: number[];
  userVoucherIds?: number[];
  addressId: number;
  deliveryFee: string;
  paymentMethod: PaymentMethodArgs;
  deliveryService?: string;
  deliveryCourier?: string;
}

export enum PaymentMethodArgs {
  DIGITAL_PAYMENT = "DIGITAL_PAYMENT",
  MANUAL_TRANSFER = "MANUAL_TRANSFER",
}

export interface ICart {
  id: number;
  storeId: number;
  userId: number;
  qty: number;
  productId: number;
  products: Product;
  stores: Store;
  isActive: boolean;
}
export interface UpdateCartArgs {
  userId: number;
  carts: ICart[];
}

export enum OrderStatus {
  WAITING_FOR_PAYMENT = "WAITING_FOR_PAYMENT",
  WAITING_ADMIN_CONFIRMATION = "WAITING_ADMIN_CONFIRMATION",
  ORDER_PROCESSED = "ORDER_PROCESSED",
  ORDER_SHIPPED = "ORDER_SHIPPED",
  ORDER_RECEIVED = "ORDER_RECEIVED",
  ORDER_CANCELLED = "ORDER_CANCELLED",
}

export interface IOrder {
  id: number;
  orderNumber: string;
  totalAmount: number;
  totalWeight?: number;
  createdAt: Date;
  updatedAt: Date;
  status: OrderStatus;
  userId: number;
  storeId: number;
  userVoucherId?: number;
  userDiscountId?: number;
  users: User;
  stores: Store;
  userDiscounts?: UserDiscount;
  userVouchers?: UserVoucher;
  OrderItems: IOrderItem[];
  Payment: IPayment;
  Delivery: Delivery[];
}

export interface IOrderItem {
  id: number;
  qty: number;
  total: number;
  discValue: number;
  originalPrice: number;
  totalWeight?: number;
  orderId: number;
  productId: number;
  userDiscountId?: number;
  userVoucherId?: number;
  orders: IOrder;
  products: Product;
  userDiscounts?: UserDiscount;
  userVouchers?: UserVoucher;
}

export interface IPayment {
  id: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  amount: number;
  paymentProof?: string;
  snapToken?: string;
  snapRedirectUrl?: string;
  orderId: number;
  orders: IOrder;
  paymentStatus: PaymentStatus;
  invoiceNumber: string;
}

export enum PaymentStatus {
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  DENIED = "DENIED",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
}

enum PaymentMethod {
  QRIS = "QRIS",
  VIRTUAL_ACCOUNT = "VIRTUAL_ACCOUNT",
  MANUAL_TRANSFER = "MANUAL_TRANSFER",
}

export interface IDelivery {
  id: number;
  deliveryFee: number;
  status: string;
  addressId: number;
  storeId: number;
  orderId: number;
  stores: Store;
  addresses: Address;
  orders: IOrder;
}

interface UserDiscount {
  id: number;
}

interface UserVoucher {
  id: number;
}
