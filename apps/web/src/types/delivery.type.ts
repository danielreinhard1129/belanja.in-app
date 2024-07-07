import { Address } from "./address.type";
import { IOrder } from "./order.type";
import { Store } from "./store.type";

export interface Delivery {
    id: number;
    deliveryNumber: string;
    deliveryFee: number;
    status: DeliveryStatus;
    createdAt: Date;
    updatedAt: Date;
    deliveryService?: string 
    deliveryCourier?: string
  
    addressId: number;
    storeId: number;
    orderId: number;
  
    stores: Store;
    addresses: Address;
    orders: IOrder;
  }
  
  export enum DeliveryStatus {
    PENDING = "PENDING",
    CANCELLED = "CANCELLED",
    ON_DELIVERY = "ON_DELIVERY",
    DELIVERED = "DELIVERED",
  }