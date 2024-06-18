import { calculateProductDiscount } from '@/lib/calculateProductDiscount';
import prisma from '@/prisma';
import { IOrderArgs } from '@/types/order.type';
import { Discount, Product, UserVoucher, userDiscount } from '@prisma/client';

interface ProductDiscountMap {
  productId: number;
  originalPrice: number;
  discValue: number;
  total: number;
}

export const createOrderService = async (body: IOrderArgs) => {
  try {
    const {
      userId,
      products,
      userDiscountIds = [],
      userVoucherIds = [],
      storeId,
    } = body;
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    //cek apakah ada userId di DB
    if (!user) {
      throw new Error('Action unauthorized!');
    }

    //cari semua produk yang id nya dikirim dari FE
    const productIds = products.map((product) => product.productId);

    const findProducts = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    //bikin MAP baru isinya products
    const productMap = new Map<number, Product>();
    findProducts.forEach((product) => productMap.set(product.id, product));
    console.log('ini findProducts', findProducts);
    console.log('ini productMap', productMap);

    //cari diskon dan bikin Map
    const discMap = new Map<number, userDiscount>();
    const discounts = await prisma.userDiscount.findMany({
      where: { id: { in: userDiscountIds }, userId, isUsed: false },
      include: { discounts: true },
    });
    discounts.forEach((discount) => discMap.set(discount.id, discount));

    //cari semua voucher yang dikirim dari FE
    const voucherMap = new Map<number, UserVoucher>();
    const vouchers = await prisma.userVoucher.findMany({
      where: { id: { in: userVoucherIds }, userId, isUsed: false },
      include: { vouchers: true },
    });
    vouchers.forEach((voucher) => voucherMap.set(voucher.id, voucher));

    // console.log('ini voucher', voucherMap);

    //TODO: include Penjumnlahaan dengan voucher & discount
    const minPurchaseDiscount = discounts.filter(
      (disc) => disc.discounts.discountType === 'MIN_PURCHASE',
    );
    const productDiscounts = discounts.filter(
      (disc) => disc.discounts.discountType === 'PRODUCT',
    );

    const productVouchers = vouchers.filter(
      (voucher) => voucher.vouchers.voucherType === 'PRODUCT',
    );

    const purchaseVoucher = vouchers.filter(
      (voucher) => voucher.vouchers.voucherType === 'PURCHASE',
    );
    // console.log('ini min purchase', purchaseVoucher);

    console.log('User:', user);
    console.log('Products:', findProducts);
    console.log('Discounts:', discounts);
    console.log('Vouchers:', vouchers);
    console.log('Product Discount:', productDiscounts);

    const prodDiscMap = new Map<number, ProductDiscountMap>();
    if (productDiscounts.length > 0) {
      const discountPromises = findProducts.map(async (product) => {
        const applicableDiscount = productDiscounts.find(
          (discount) => discount.discounts.productId === product.id,
        );

        if (applicableDiscount) {
          try {
            const discountedPrice = await calculateProductDiscount(
              product.id,
              applicableDiscount.id,
              userId,
            );
            const discountValue = product.price - discountedPrice;
            prodDiscMap.set(product.id, {
              productId: product.id,
              originalPrice: product.price,
              discValue: discountValue,
              total: discountedPrice,
            });
          } catch (error) {
            console.error(
              `Error calculating discount for product ID ${product.id}:`,
              error,
            );
          }
        } else {
          // No discount for this product, use the original price
          prodDiscMap.set(product.id, {
            productId: product.id,
            originalPrice: product.price,
            discValue: 0,
            total: product.price,
          });
        }
      });

      await Promise.all(discountPromises);
    }

    const prodVoucherMap = new Map<number, ProductDiscountMap>();
    if (productVouchers.length > 0) {
      const voucherPromises = findProducts.map(async (product) => {
        const applicableVouchers = productVouchers.find(
          (voucher) => voucher.vouchers.productId === product.id,
        );

        if (applicableVouchers) {
          try {
            const discountedPrice = await calculateProductDiscount(
              product.id,
              applicableVouchers.id,
              userId,
            );
            const discountValue = product.price - discountedPrice;
            prodVoucherMap.set(product.id, {
              productId: product.id,
              originalPrice: product.price,
              discValue: discountValue,
              total: discountedPrice,
            });
          } catch (error) {
            console.error(
              `Error calculating voucher for product ID ${product.id}:`,
              error,
            );
          }
        } else {
          // No discount for this product, use the original price
          prodVoucherMap.set(product.id, {
            productId: product.id,
            originalPrice: product.price,
            discValue: 0,
            total: product.price,
          });
        }
      });

      await Promise.all(voucherPromises);
    }
    console.log('ini prodVoucher', prodVoucherMap);

    let totalAmount = 0;
    //apply product discounts
    // products.forEach((product) => {
    //   const discountedPrice = prodDiscMap.get(product.productId);
    //   if (discountedPrice !== undefined) {
    //     totalAmount += discountedPrice.total * product.qty;
    //   } else {
    //     const originalProduct = productMap.get(product.productId);
    //     if (originalProduct) {
    //       totalAmount += originalProduct.price * product.qty;
    //     }
    //   }
    //   const voucheredProdPrice = prodVoucherMap.get(product.productId)
    //   if (voucheredProdPrice !== undefined){
    //     totalAmount += voucheredProdPrice.total * product.qty
    //   }
    // });

    // products.forEach((product) => {
    //   let finalPrice = 0;
    //   const discountData = prodDiscMap.get(product.productId);
    //   const voucherData = prodVoucherMap.get(product.productId);

    //   console.log("ini discountData" ,discountData);
    //   console.log("ini voucherData" ,voucherData);

    //   if (voucherData) {
    //     finalPrice = voucherData.total;
    //   } else if (discountData) {
    //     finalPrice = discountData.total;
    //   } else {
    //     const originalProduct = productMap.get(product.productId);
    //     if (originalProduct) {
    //       finalPrice = originalProduct.price;
    //     }
    //   }

    //   totalAmount += finalPrice * product.qty;
    // });
    const orderItems = products.map((product) => {
      let finalPrice = 0;
      let itemDiscountId: number | null = null;
      let itemVoucherId: number | null = null;

      const discountData = prodDiscMap.get(product.productId);
      const voucherData = prodVoucherMap.get(product.productId);

      if (discountData && voucherData) {
        finalPrice = voucherData.total;
        itemVoucherId = voucherData.total ? userVoucherIds[0] : null;
      } else if (discountData) {
        finalPrice = discountData.total;
        itemDiscountId = discountData.discValue ? userDiscountIds[0] : null;
      } else if (voucherData) {
        finalPrice = voucherData.total;
        itemVoucherId = voucherData.total ? userVoucherIds[0] : null;
      } else {
        const originalProduct = productMap.get(product.productId);
        if (originalProduct) {
          finalPrice = originalProduct.price;
        }
      }

      totalAmount += finalPrice * product.qty;

      return {
        productId: product.productId,
        qty: product.qty,
        originalPrice: productMap.get(product.productId)!.price,
        discValue: discountData ? discountData.discValue : 0,
        total: finalPrice * product.qty,
        userDiscountId: itemDiscountId,
        userVoucherId: itemVoucherId,
      };
    });

    // Apply minimum purchase discounts
    minPurchaseDiscount.forEach((discount) => {
      if (totalAmount >= discount.discounts.minPurchase!) {
        totalAmount =
          totalAmount - totalAmount * (discount.discounts.discountvalue / 100);
      }
    });

    // const order = await prisma.order.create({
    //   data: {
    //     userId,
    //     storeId,
    //     totalAmount,
    //     userDiscountId: minPurchaseDiscount.length > 0 ? minPurchaseDiscount[0].id : null,
    //     userVoucherId: purchaseVoucher.length > 0 ? purchaseVoucher[0].id: null,
    //     OrderItems: {
    //       create: products.map((product) => {
    //         const discountData = prodDiscMap.get(product.productId);
    //         return {
    //           productId: product.productId,
    //           qty: product.qty,
    //           originalPrice: discountData
    //             ? discountData.originalPrice
    //             : productMap.get(product.productId)!.price,
    //           discValue: discountData ? discountData.discValue : 0,
    //           total: discountData
    //             ? discountData.total * product.qty
    //             : productMap.get(product.productId)!.price * product.qty,
    //           userDiscountId:
    //             productDiscount.length > 0 ? productDiscount[0].id : null,
    //         };
    //       }),
    //     },
    //   },
    //   include: {
    //     OrderItems: true,
    //   },
    // });

    return {
      discounts,
      findProducts,
      vouchers,
      totalAmount,
      orderItems
    };
    // return order
  } catch (error) {
    throw error;
  }
};
