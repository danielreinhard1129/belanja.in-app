import prisma from '@/prisma';
import { Product } from '@prisma/client';
import fs from 'fs';

interface CreateProductBody
  extends Omit<Product, 'id' | 'isDelete' | 'createdAt' | 'updatedAt'> {
  user: string;
  categories: string;
}

export const createProductService = async (
  body: CreateProductBody,
  files: Express.Multer.File[],
) => {
  try {
    const { name, description, price, weight, categories, user } = body;

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

    const existingName = await prisma.product.findUnique({
      where: { name },
    });

    if (existingName) {
      if (existingName.isDelete) {
        const reactivatedProduct = await prisma.product.update({
          where: {
            id: existingName.id,
          },
          data: {
            name,
            description,
            price: Number(price),
            weight: Number(weight),
            isDelete: false,
            categories: {
              deleteMany: {},
              create: JSON.parse(categories).map((category: any) => ({
                categoryId: Number(category),
              })),
            },
            images: {
              deleteMany: {},
              create: files.map((file) => ({
                images: `/images/${file.filename}`,
              })),
            },
          },
          include: {
            categories: {
              include: {
                category: true,
              },
            },
            images: true,
          },
        });

        return {
          message: 'Product has been reactivated',
          data: reactivatedProduct,
        };
      } else {
        throw new Error('Product name already used');
      }
    }

    if (!categories || categories.length === 0) {
      throw new Error('Category cannot be empty');
    }

    const categoriesArray = JSON.parse(categories);

    const createProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        weight: Number(weight),
        isDelete: false,
        categories: {
          create: categoriesArray.map((category: any) => ({
            categoryId: Number(category),
          })),
        },
        images: {
          create: files.map((file) => ({
            images: `/images/${file.filename}`,
          })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
        images: true,
      },
    });

    return {
      message: 'Product has been created',
      data: createProduct,
    };
  } catch (error) {
    files.forEach((file) => {
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    });
    throw error;
  }
};
