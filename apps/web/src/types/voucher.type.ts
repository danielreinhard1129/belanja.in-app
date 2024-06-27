import { Product } from "./product.type";

export interface Voucher {
  id: number;
  code: string;
  description: string;
  voucherType: string;
  discountValue: number;
  expiredDate: string;
  productId: number;
  products: Product;
  UserVoucher: [];
}
