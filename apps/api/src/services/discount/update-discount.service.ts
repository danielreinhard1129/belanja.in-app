import prisma from '@/prisma';
import { Discount } from '@prisma/client';

interface UserToken {
  id: number;
  role: string;
}

export const updateDiscountService = async (
  id: number,
  body: Omit<Discount, 'id'>,
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
      isActive,
    } = body;

    // Check if the requesting user exists and get their role
    const checkUser = await prisma.user.findUnique({
      where: {
        id: Number(user.id),
      },
    });

    if (!checkUser) {
      throw new Error("Can't find your account");
    }

    if (checkUser.role === 'USER') {
      throw new Error('Unauthorized access');
    }

    let finalStoreId = storeId;
    let storeName: string | null = null;

    if (checkUser.role === 'SUPERADMIN') {
      // Ambil nama store untuk SUPERADMIN
      const store = await prisma.store.findUnique({
        where: {
          id: Number(finalStoreId),
        },
      });

      if (!store) {
        throw new Error("Can't find the selected store");
      }

      storeName = store.name;
    } else {
      // Cari storeAdmin berdasarkan user.id
      const storeAdmin = await prisma.storeAdmin.findUnique({
        where: {
          userId: Number(user.id),
        },
      });

      if (!storeAdmin) {
        throw new Error("Can't find store admin associated with your account");
      }

      // Cari store berdasarkan storeAdmin.id
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

    // Melakukan pengecekan productId yang ada di store
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

    // Update discount
    const updateDiscount = await prisma.discount.update({
      where: { id },
      data: {
        title,
        desc,
        discountType: discountType,
        discountvalue: Number(discountvalue),
        discountLimit: Number(discountLimit),
        minPurchase: Number(minPurchase),
        isActive: isActive,
        storeId: Number(finalStoreId),
        productId: Number(productId),
      },
    });

    return {
      message: 'Discount has been updated',
      data: updateDiscount,
    };
  } catch (error) {
    throw error;
  }
};
