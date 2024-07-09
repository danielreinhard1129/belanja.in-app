import { getDistance } from '@/libs/getDistance';
import prisma from '@/prisma';
import { Prisma } from '@prisma/client';

interface GetProductsByIdQueryParams {
  lat?: number;
  long?: number;
  radius?: number;
  productId: number;
}

export const getProductService = async (query: GetProductsByIdQueryParams) => {
  const { lat, long, radius = 50, productId } = query;

  if (!productId) {
    throw new Error('Product not found');
  }

  try {
    const stores = await prisma.store.findMany();

    let closestStoreId: number | undefined;
    if (lat && long) {
      const nearbyStores = stores
        .filter((store) =>
          lat && long
            ? getDistance(lat, long, store.lat, store.long) <= radius
            : true,
        )
        .sort((a, b) =>
          lat && long
            ? getDistance(lat, long, a.lat, a.long) -
              getDistance(lat, long, b.lat, b.long)
            : 0,
        );
      if (nearbyStores.length > 0) {
        closestStoreId = nearbyStores[0].id;
      }
    }

    const where: Prisma.StoreProductWhereInput = {
      productId,
      product: { isDelete: false },
      isActive: true,
      store: { isDelete: false },
    };

    const storeProduct = await prisma.storeProduct.findFirst({
      where: {
        ...where,
        ...(closestStoreId
          ? { storeId: closestStoreId }
          : {
              store: {
                isPrimary: true,
                isDelete: false,
              },
            }),
      },
      include: {
        product: {
          include: {
            images: true,
            categories: { include: { category: true } },
            discounts: true,
          },
        },
        store: { include: { City: true } },
      },
    });

    if (!storeProduct) {
      throw new Error('Product not found');
    }

    return storeProduct;
  } catch (error) {
    throw error;
  }
};
