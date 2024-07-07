import { getDistance } from '@/libs/getDistance';
import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';
import { Prisma, Store } from '@prisma/client';

interface GetProductsByLocationArgs extends PaginationQueryParams {
  lat?: number;
  long?: number;
  radius?: number;
  category?: string;
  search?: string;
}

export const getProductsByLocationService = async (
  query: GetProductsByLocationArgs,
) => {
  const { lat, long, radius = 10, take, page, category, search } = query;
  try {
    const stores = await prisma.store.findMany();

    let nearbyStores: Store[] = [];
    if (lat && long) {
      nearbyStores = stores.filter((store) => {
        const distance = getDistance(lat, long, store.lat, store.long);
        return distance <= radius * 2;
      });
    }

    const storeIds = nearbyStores.map((store) => store.id);

    const where: Prisma.StoreProductWhereInput = {
      product: {
        isDelete: false,
      },
      isActive: true,
      store: {
        isDelete: false,
        ...(lat || long ? {} : { isPrimary: true }),
      },
    };

    if (category && category !== 'all') {
      where.product = {
        categories: {
          some: {
            category: {
              name: category,
            },
          },
        },
      };
    }

    if (search) {
      where.product = {
        name: {
          contains: search,
        },
      };
    }

    let storeProduct;
    let count;

    storeProduct = await prisma.storeProduct.findMany({
      where: {
        ...(storeIds.length > 0 ? { storeId: { in: storeIds } } : {}),
        product: {
          isDelete: false,
        },
        ...where,
      },
      include: {
        product: {
          include: {
            images: true,
            categories: {
              include: {
                category: true,
              },
            },
          },
        },
        store: {
          include: {
            City: true,
          },
        },
      },
      skip: (page - 1) * take,
      take: take,
    });

    count = await prisma.storeProduct.count({
      where: {
        ...(storeIds.length > 0 ? { storeId: { in: storeIds } } : {}),
        product: {
          isDelete: false,
        },
        ...where,
      },
    });

    return { data: storeProduct, meta: { page, take, total: count } };
  } catch (error) {
    throw error;
  }
};
