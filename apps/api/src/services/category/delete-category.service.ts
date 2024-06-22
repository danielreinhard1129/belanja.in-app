import prisma from '@/prisma';

export const deleteCategoryService = async (id: number) => {
  try {
    const category = await prisma.category.findFirst({
      where: { id },
    });

    if (!category) {
      throw new Error('invalid category id');
    }

    await prisma.category.update({
      where: { id },
      data: { isDelete: true },
    });
  } catch (error) {
    throw error;
  }
};
