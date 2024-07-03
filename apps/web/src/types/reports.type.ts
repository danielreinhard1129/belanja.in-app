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

interface OrderItemWithProduct extends OrderItem {
  products: Product;
}

interface Order {
  id: number;
  totalAmount: number;
  totalWeight: number | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  userId: number;
  storeId: number;
  userVoucherId: number | null;
  userDiscountId: number | null;
  OrderItems: OrderItem[];
}

interface OrderWithProduct extends Order {
  OrderItems: OrderItemWithProduct[];
}

export interface SalesReportResponse {
  salesReport: Order[];
  salesReportByCategory: OrderWithProduct[];
  salesReportByProduct: OrderWithProduct[];
  totalAmountSalesReport: number;
  totalAmountSalesReportByCategory: number;
  totalAmountSalesReportByProduct: number;
}
