import prisma from '@/prisma';
import { Category } from '@prisma/client';

export const updateCategoryService = async (
  id: number,
  body: Pick<Category, 'name'>,
) => {
  try {
    const { name } = body;

    // Validate if the category ID exists
    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error('Category not found');
    }

    // Check if the new name is already in use by another active category
    if (name !== category.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name,
          isDelete: false,
          id: { not: id }, // Exclude the current category ID
        },
      });

      if (existingCategory) {
        throw new Error('Name already in use');
      }
    }

    // Update the category
    const updateCategory = await prisma.category.update({
      where: { id },
      data: { name },
    });
    return { message: 'Update Category Success', data: updateCategory };
  } catch (error) {
    throw error;
  }
};
