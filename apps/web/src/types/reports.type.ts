interface OrderItem {
  id: number;
  qty: number;
  total: number;
  discValue: number;
  originalPrice: number;
  totalWeight: number | null;
  orderId: number;
  productId: number;
  userDiscountId: number | null;
  userVoucherId: number | null;
  products?: Product;
}
interface Product {
  id: number;
  name: string;
  description: string;
  weight: number;
  price: number;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  categories?: Category[];
}

interface Category {
  categoryId: number;
  productId: number;
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
}

export interface SalesReportResponse {
  salesReport: Order[];
  totalAmountSalesReport: number;
}

export interface SalesReportByCategoryResponse {
  salesReportByCategory: Order[];
  totalAmountSalesReportByCategory: number;
}

export interface SalesReportByProductResponse {
  salesReportByProduct: Order[];
  totalAmountSalesReportByProduct: number;
}
