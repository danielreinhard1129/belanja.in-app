// OrderItem.ts
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

// Product.ts
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

// Category.ts
interface Category {
  categoryId: number;
  productId: number;
}

// Order.ts
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

// SalesReportResponse.ts
export interface SalesReportResponse {
  salesReport: Order[];
  totalAmountSalesReport: number;
}

// SalesReportByCategoryResponse.ts
export interface SalesReportByCategoryResponse {
  salesReportByCategory: Order[];
  totalAmountSalesReportByCategory: number;
}

// SalesReportByProductResponse.ts
export interface SalesReportByProductResponse {
  salesReportByProduct: Order[];
  totalAmountSalesReportByProduct: number;
}
