import prisma from '@/prisma';

export const calculateProductDiscount = async (
  productId: number,
  userDiscountId: number,
  userId: number,
) => {
  // Fetch the product
  const product = await prisma.product.findFirst({
    where: {
      id: productId,
    },
  });
  if (!product) {
    throw new Error(`Product with ID ${productId} is not found!`);
  }

  // Fetch the discount
  const discount = await prisma.userDiscount.findFirst({
    where: {
      id: userDiscountId,
      userId,
      isUsed: false,
      discounts: {
        discountType: 'PRODUCT',
        productId,
      },
    },
    include: { discounts: true },
  });
  if (!discount) {
    throw new Error(`Discount for product ID ${productId} not found!`);
  }

  // Ensure the discount value is valid
  if (typeof discount.discounts.discountvalue !== 'number' || discount.discounts.discountvalue <= 0) {
    throw new Error(`Invalid discount value for product ID ${productId}!`);
  }

  // Calculate the discounted price
  const total = product.price - product.price * (discount.discounts.discountvalue / 100);

  // Ensure the total price is not negative
  if (total < 0) {
    throw new Error(`Discount calculation error: negative price for product ID ${productId}!`);
  }

  return total;
};
