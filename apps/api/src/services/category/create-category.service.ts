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

    if (user.role !== 'SUPERADMIN') throw new Error("User do'nt have access");

    const existingName = await prisma.category.findFirst({
      where: {
        name,
      },
    });

    if (existingName) throw new Error('Name already exist');

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
