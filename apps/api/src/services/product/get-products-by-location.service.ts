import { getDistance } from '@/libs/getDistance';
import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';
import { Prisma } from '@prisma/client';

interface GetProductsByLocationArgs extends PaginationQueryParams {
  lat: number;
  long: number;
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

    const nearbyStores = stores.filter((store) => {
      if (lat && long) {
        const distance = getDistance(lat, long, store.lat, store.long);
        return distance <= radius * 2;
      } else {
        return true;
      }
    });

    const storeIds = nearbyStores.map((store) => store.id);

    const where: Prisma.StoreProductWhereInput = {
      product: {
        isDelete: false,
      },
    };

    if (category && category !== 'all') {
      where.product = {
        // some: {
        //   category: {
        //     name: category
        //   }
        // }
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

    if (!lat && !long) {
      storeProduct = await prisma.storeProduct.findMany({
        where: {
          store: {
            isPrimary: true,
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
          store: true,
        },
        skip: (page - 1) * take,
        take: take,
      });
      count = await prisma.storeProduct.count({
        where: {
          store: {
            isPrimary: true,
          },
          ...where,
        },
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
          ...where,
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
      count = await prisma.storeProduct.count({
        where,
      });
    }

    return { data: storeProduct, meta: { page, take, total: count } };
  } catch (error) {
    throw error;
  }
};
