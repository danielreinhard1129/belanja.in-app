import prisma from '@/prisma';

export const getProductsByStoreService = async (id: number) => {
  try {
    // Fetch all product for the given store
    const products = await prisma.product.findMany({
      where: {
        storeProduct: {
          some: {
            storeId: id,
          },
        },
      },
    });

    if (!products) {
      throw new Error('No product found for this store');
    }

    // // Calculate total quantity of stock for the given store
    // const totalQuantityStore = await prisma.storeProduct.aggregate({
    //   _sum: {
    //     qty: true,
    //   },
    //   where: {
    //     storeId,
    //   },
    // });

    // const totalQty = totalQuantityStore._sum.qty || 0;

    // // Update the qty field in the Store model
    // await prisma.store.update({
    //   where: { id: storeId },
    //   data: { qty: totalQty },
    // });

    // // Add total field to each stock object
    // const stocksWithTotal = stocks.map((stock) => ({
    //   ...stock,
    //   total: totalQty, // Assigning totalQty to each stock
    // }));

    // Return the stocks
    return products;
  } catch (error) {
    throw error;
  }
};
