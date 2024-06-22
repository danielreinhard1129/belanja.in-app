import prisma from '@/prisma';

export const getCategoriesService = async () => {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isDelete: false,
      },
    });

    if (!categories) {
      throw new Error('Categories not found');
    }

    return categories;
  } catch (error) {
    throw error;
  }
};
