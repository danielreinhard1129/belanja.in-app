import prisma from '@/prisma';
import { Product } from '@prisma/client';
import { join } from 'path';
import fs from 'fs';

interface UpdateProductBody
  extends Partial<
    Omit<Product, 'id' | 'isDelete' | 'createdAt' | 'updatedAt'>
  > {
  user: string;
  categories?: string;
}

// jika pindah admin tambah ../ satu
const defaultDir = '../../../public/images';

export const updateProductService = async (
  id: number,
  body: UpdateProductBody,
  files: Express.Multer.File[],
) => {
  try {
    // tambahin userId jika redux sudah berhasil
    const { name, description, price, weight, categories, user } = body;

    // Check if product exists
    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new Error('product not found');
    }

    // Check if user exists and is admin
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

    // Check if categoryIds is empty
    if (!categories || categories.length === 0) {
      throw new Error('Category cannot be empty');
    }

    const categoriesArray = JSON.parse(categories); // Parse JSON string to array

    // Handle file uploads and deletions
    if (files && files.length > 0) {
      const existingImages = await prisma.productImage.findMany({
        where: { productId: id },
      });

      // Delete existing images from storage
      existingImages.forEach((images) => {
        const imagePath = join(__dirname, defaultDir, images.images);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });

      // Delete existing images from database
      await prisma.productImage.deleteMany({
        where: { productId: id },
      });

      // Create new images
      await prisma.productImage.createMany({
        data: files.map((file) => ({
          productId: id,
          images: `/images/${file.filename}`,
        })),
      });
    }

    // Update product
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
