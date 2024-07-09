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
  const { lat, long, radius = 50, take, page, category, search } = query;
  try {
    const stores = await prisma.store.findMany();

    let nearbyStores: Store[] = [];
    if (lat && long) {
      nearbyStores = stores.filter((store) => {
        const distance = getDistance(lat, long, store.lat, store.long);
        return distance <= radius;
      });
    }

    const storeIds = nearbyStores.map((store) => store.id);

    const categoryArgs = category && category === 'all' ? undefined : category;

    const where: Prisma.StoreProductWhereInput = {
      product: {
        isDelete: false,
        categories: {
          every: {
            category: {
              name: categoryArgs,
            },
          },
        },
        name: {
          contains: search,
        },
      },
      isActive: true,
    };

    let storeProduct;
    let count;

    storeProduct = await prisma.storeProduct.findMany({
      where: {
        ...(storeIds.length > 0
          ? {
              storeId: { in: storeIds },
            }
          : {
              store: {
                isPrimary: true,
                isDelete: false,
              },
            }),
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
        ...(storeIds.length > 0
          ? {
              storeId: { in: storeIds },
            }
          : {
              store: {
                isPrimary: true,
                isDelete: false,
              },
            }),
        ...where,
      },
    });

    return { data: storeProduct, meta: { page, take, total: count } };
  } catch (error) {
    throw error;
  }
};
