import prisma from '@/prisma';
import { Discount } from '@prisma/client';

interface CreateDiscount extends Omit<Discount, 'id'> {}

interface UserToken {
  id: number;
  role: string;
}

export const createDiscountService = async (
  body: CreateDiscount,
  user: UserToken,
) => {
  try {
    const {
      title,
      desc,
      discountType,
      discountvalue,
      discountLimit,
      productId,
      minPurchase,
      storeId,
    } = body;

    // Cari user berdasarkan user.id
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') throw new Error('Unauthorized access');

    let finalStoreId = storeId;
    let storeName: string | null = null;

    if (checkUser.role === 'SUPERADMIN' && storeId) {
      const store = await prisma.store.findUnique({
        where: {
          id: Number(storeId),
        },
      });

      if (!store) {
        throw new Error("Can't find the selected store");
      }

      storeName = store.name;
    } else {
      const storeAdmin = await prisma.storeAdmin.findUnique({
        where: {
          userId: Number(user.id),
        },
      });

      if (!storeAdmin) {
        throw new Error("Can't find store admin associated with your account");
      }

      const store = await prisma.store.findUnique({
        where: {
          storeAdminId: storeAdmin.id,
        },
      });

      if (!store) {
        throw new Error("Can't find store associated with your account");
      }

      // Gunakan store.id jika body.storeId kosong
      finalStoreId = finalStoreId || store.id;
      storeName = store.name;
    }

    if (productId) {
      const checkProductInStore = await prisma.storeProduct.findFirst({
        where: {
          storeId: Number(finalStoreId),
          productId: Number(productId),
        },
      });

      if (!checkProductInStore) {
        // Ambil informasi produk
        const product = await prisma.product.findUnique({
          where: {
            id: Number(productId),
          },
        });

        if (!product) {
          throw new Error('Product not found');
        }

        if (checkUser.role === 'SUPERADMIN') {
          throw new Error(
            `Product ${product.name} is not found in store ${storeName}`,
          );
        } else {
          throw new Error(
            `Product ${product.name} is not found in your store ${storeName}`,
          );
        }
      }
    }

    const createDiscount = await prisma.discount.create({
      data: {
        title,
        desc,
        discountType: discountType,
        discountvalue: Number(discountvalue),
        discountLimit: Number(discountLimit),
        minPurchase: Number(minPurchase),
        isActive: true,
        storeId: Number(finalStoreId),
        productId: productId ? Number(productId) : undefined,
      },
    });

    return {
      message: 'Discount has been created',
      data: createDiscount,
    };
  } catch (error) {
    throw error;
  }
};
