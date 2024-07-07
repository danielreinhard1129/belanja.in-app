import prisma from '@/prisma';
import { Product } from '@prisma/client';
import fs from 'fs';
import { join } from 'path';

interface UpdateProductBody
  extends Partial<
    Omit<Product, 'id' | 'isDelete' | 'createdAt' | 'updatedAt'>
  > {
  user: string;
  categories?: string;
}

const defaultDir = '../../../public/images';

export const updateProductService = async (
  id: number,
  body: UpdateProductBody,
  files: Express.Multer.File[],
) => {
  try {
    const { name, description, price, weight, categories, user } = body;

    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new Error('product not found');
    }

    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

    if (name) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          name,
          NOT: {
            id,
          },
        },
      });

      if (existingProduct) {
        throw new Error('Name already in use');
      }
    }

    if (!categories || categories.length === 0) {
      throw new Error('Category cannot be empty');
    }

    const categoriesArray = JSON.parse(categories);

    if (files && files.length > 0) {
      const existingImages = await prisma.productImage.findMany({
        where: { productId: id },
      });

      existingImages.forEach((images) => {
        const imagePath = join(__dirname, defaultDir, images.images);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      await prisma.productImage.createMany({
        data: files.map((file) => ({
          productId: id,
          images: `/images/${file.filename}`,
        })),
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: Number(price),
        weight: Number(weight),
        ...(categoriesArray && {
          categories: {
            deleteMany: {},
            create: categoriesArray.map((category: any) => ({
              categoryId: Number(category),
            })),
          },
        }),
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
      message: 'Product has been updated',
      data: updatedProduct,
    };
  } catch (error) {
    if (files && files.length > 0) {
      files.forEach((file) => {
        const imagePath = join(__dirname, defaultDir, file.filename);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    throw error;
  }
};
