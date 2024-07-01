import prisma from '@/prisma';
import { PaginationQueryParams } from '@/types/pagination.type';
import { Prisma } from '@prisma/client';

interface GetProvincesQuery extends PaginationQueryParams {
  search: string;
}

export const getProvincesService = async (query: GetProvincesQuery) => {
  try {
    const { page, search, sortBy, sortOrder, take } = query;

    const whereClause: Prisma.ProvinceWhereInput = {
      provinceName: {contains: search}
    }

    const provinces = await prisma.province.findMany({
      where: whereClause,
      skip: (page - 1) * take,
      take: take,
      orderBy: {
        [sortBy]: sortOrder
      }
    });
    if (!provinces) {
      throw new Error("there's no province");
    }

    return provinces;
  } catch (error) {
    throw error;
  }
};
