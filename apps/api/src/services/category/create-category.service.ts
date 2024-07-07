import prisma from '@/prisma';
import { Category } from '@prisma/client';

interface CreateCategory extends Omit<Category, 'id'> {
  userId: number;
}

export const createCategoryService = async (body: CreateCategory) => {
  try {
    const { name, userId } = body;

    if (!userId) throw new Error(`user not found ${userId}`);

    const user = await prisma.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!user) throw new Error('user not found');

    if (user.role !== 'SUPERADMIN') throw new Error("User don't have access");

    const existingCategory = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (existingCategory) {
      if (existingCategory.isDelete) {
        const updatedCategory = await prisma.category.update({
          where: {
            id: existingCategory.id,
          },
          data: {
            isDelete: false,
          },
        });

        return { message: 'Category reactivated', data: updatedCategory };
      } else {
        throw new Error('Name already exist');
      }
    }

    const createCategory = await prisma.category.create({
      data: {
        name: name,
      },
    });

    return { message: 'Create Category Success', data: createCategory };
  } catch (error) {
    throw error;
  }
};
