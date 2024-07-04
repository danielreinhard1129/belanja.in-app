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

    const where: any = {
      isDelete: false,
      storeProduct: {
        some: {
          storeId: {
            in: storeIds,
          },
        },
      },
    };

    const products = await prisma.product.findMany({
      where,
      include: {
        storeProduct: true,
        images: true,
        categories: {
          select: {
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    const count = await prisma.product.count({ where });

    return {
      data: products,
      nearbyStores,
      meta: { page, take, total: count },
    };
  } catch (error) {
    throw error;
  }
};
