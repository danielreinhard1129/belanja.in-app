import prisma from '@/prisma';

export const calculateProductVoucher = async (
  productId: number,
  userDiscountId: number,
  userId: number,
) => {
  // Fetch the product
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
      isDelete: false
    },
  });
  if (!product) {
    throw new Error(`Product with ID ${productId} is not found!`);
  }

  // Fetch the discount
  const voucher = await prisma.userVoucher.findFirst({
    where: {
      id: userDiscountId,
      userId,
      isUsed: false,
      vouchers: {
        voucherType: 'PRODUCT',
        productId,
      },
    },
    include: { vouchers: true },
  });
  if (!voucher) {
    throw new Error(`Voucher for product ID ${productId} not found!`);
  }

  // Ensure the discount value is valid
  if (typeof voucher.vouchers.discountValue !== 'number' || voucher.vouchers.discountValue <= 0) {
    throw new Error(`Invalid discount value for product ID ${productId}!`);
  }

  // Calculate the discounted price
  const total = product.price - product.price * (voucher.vouchers.discountValue / 100);

  // Ensure the total price is not negative
  if (total < 0) {
    throw new Error(`Discount calculation error: negative price for product ID ${productId}!`);
  }

  return total;
};
