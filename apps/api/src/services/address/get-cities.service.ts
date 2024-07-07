import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';
import { Prisma } from '@prisma/client';

interface GetCitiesQuery extends PaginationQueryParams {
  provinceId: number;
}

export const getCitiesByProvinceIdService = async (query: GetCitiesQuery) => {
  try {
    const { page, provinceId, sortBy, sortOrder, take } = query;

    const whereClause: Prisma.CityWhereInput = {
      provinceId: provinceId
    }

    const cities = await prisma.city.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder
      }
    });
    if (!cities || cities.length === 0) {
      throw new Error("No cities found for the given province ID");
    }

    return cities;
  } catch (error) {
    throw error;
  }
};
