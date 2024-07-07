import prisma from '@/prisma';

interface Args {
  storeId: number;
  productIds: string[];
}

export const getDiscountsByUserService = async (body: Args) => {
  try {
    const { productIds, storeId } = body;

    const productIdsArgs =
      productIds && productIds.length ? productIds.map((a) => parseInt(a)) : [];

    // Fetch discounts associated with specific products
    const productDiscounts = storeId
      ? await prisma.discount.findMany({
          where: {
            storeId,
            isActive: true,
            productId: { in: productIdsArgs },
          },
          include: {
            product: true,
            store: true,
          },
        })
      : [];

    // Fetch discounts of type MIN_PURCHASE with no specific product ID
    const minPurchaseDiscounts = storeId
      ? await prisma.discount.findMany({
          where: {
            storeId,
            isActive: true,
            discountType: 'MIN_PURCHASE',
          },
          include: {
            product: true,
            store: true,
          },
        })
      : [];

    // Combine the results
    const combinedResults = [...productDiscounts, ...minPurchaseDiscounts];

    if (combinedResults.length === 0) {
      throw new Error('No discount found');
    }

    // Add isSelected property
    const discounts = combinedResults.length
      ? combinedResults.map((result) => ({
          ...result,
          isSelected: false,
        }))
      : [];

    return discounts;
  } catch (error) {
    throw error;
  }
};
