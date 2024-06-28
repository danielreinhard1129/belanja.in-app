import { Product } from "./product.type";

export interface Voucher {
  id: number;
  code: string;
  description: string;
  voucherType: string;
  discountValue: number;
  isActive: boolean;
  productId: number;
  products: Product;
  UserVoucher: [];
}
