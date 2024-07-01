interface Product {
  id: number;
  name: string;
  description: string;
  weight: number;
  price: number;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
}

interface City {
  id: number;
  provinceId: number;
  citName: string;
  postal_code: string;
  storeId: number | null;
}

interface Store {
  id: number;
  name: string;
  qty: number;
  lat: number;
  long: number;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  cityId: number;
  storeAdminId: number;
  City: City;
}

interface OrderItem {
  id: number;
  qty: number;
  total: number;
  discValue: number;
  originalPrice: number;
  totalWeight: number;
  orderId: number;
  productId: number;
  userDiscountId: number | null;
  userVoucherId: number | null;
  products: Product;
}

interface Order {
  id: number;
  totalAmount: number;
  totalWeight: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  userId: number;
  storeId: number;
  userVoucherId: number | null;
  userDiscountId: number | null;
  OrderItems: OrderItem[];
  stores: Store;
}

export interface OrderReportResponse {
  data: Order[];
  totalSales: number;
  message: string;
}
