import { getDistance } from '@/libs/getDistance';
import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';

interface GetProductsByLocationArgs extends PaginationQueryParams {
  lat: number;
  long: number;
  radius?: number;
}

export const getProductsByLocationService = async (
  query: GetProductsByLocationArgs,
) => {
  const { lat, long, radius = 10, take, page, sortBy, sortOrder } = query;
  try {
    const stores = await prisma.store.findMany();

    const nearbyStores = stores.filter((store) => {
      const distance = getDistance(lat, long, store.lat, store.long);
      return distance <= radius;
    });

    const storeIds = nearbyStores.map((store) => store.id);

    let storeProduct;

    if (!lat && !long) {
      storeProduct = await prisma.storeProduct.findMany({
        where: {
          store: {
            isPrimary: true,
          },
          product: {
            isDelete: false,
          },
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
          store: true,
        },
        skip: (page - 1) * take,
        take: take,
      });
    } else {
      storeProduct = await prisma.storeProduct.findMany({
        where: {
          storeId: {
            in: storeIds,
          },
          product: {
            isDelete: false,
          },
        },
        include: {
          product: {
            include: {
              images: true,
            },
          },
          store: true,
        },
        skip: (page - 1) * take,
        take: take,
      });
    }

    const count = await prisma.storeProduct.count({
      where: {
        store: {
          isPrimary: true,
        },
        product: {
          isDelete: false,
        },
      },
    });

    return { data: storeProduct, meta: { page, take, total: count } };
  } catch (error) {
    throw error;
  }
};
