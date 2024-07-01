import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';
import { Prisma } from '@prisma/client';

interface GetSubdistrictsQuery extends PaginationQueryParams {
  cityId: number;
}

export const getSubdistrictsService = async (query: GetSubdistrictsQuery) => {
  try {
    const { page, cityId, sortBy, sortOrder, take } = query;

    const whereClause: Prisma.SubdistrictWhereInput = {
      cityId: cityId,
    };

    const subdistricts = await prisma.subdistrict.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });
    if (!subdistricts || subdistricts.length === 0) {
      throw new Error('No subdistricts found for the given city ID');
    }

    return subdistricts;
  } catch (error) {
    throw error;
  }
};
