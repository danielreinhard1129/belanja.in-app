// import { calculateProductDiscount } from '@/lib/calculateProductDiscount';
// import prisma from '@/prisma';
// import { IUserVoucher } from '@/types/discount-voucher.type';
// import { IOrderArgs } from '@/types/order.type';
// import { Product, UserVoucher, userDiscount } from '@prisma/client';

// interface ProductDiscountMap {
//   originalPrice: number;
//   discValue: number;
//   total: number;
// }

// // Helper function to filter by discount or voucher type
// const filterByType = <T extends { discountType?: string; voucherType?: string }>(
//   items: T[],
//   type: string,
//   key: keyof T
// ) => items.filter((item) => item[key] === type);

// export const createOrderService = async (body: IOrderArgs) => {
//   try {
//     const { userId, products, userDiscountIds = [], userVoucherIds = [], storeId } = body;

//     // Fetch the user
//     const user = await prisma.user.findFirst({ where: { id: userId } });
//     if (!user) {
//       throw new Error('Action unauthorized!');
//     }

//     // Fetch all products
//     const productIds = products.map((product) => product.productId);
//     const findProducts = await prisma.product.findMany({ where: { id: { in: productIds } } });
//     const productMap = new Map<number, Product>();
//     findProducts.forEach((product) => productMap.set(product.id, product));

//     // Fetch applicable discounts and create a map
//     const discounts = await prisma.userDiscount.findMany({
//       where: { id: { in: userDiscountIds }, userId, isUsed: false },
//       include: { discounts: true },
//     });
//     const discMap = new Map<number, userDiscount>();
//     discounts.forEach((discount) => discMap.set(discount.id, discount));

//     // Fetch applicable vouchers and create a map
//     const vouchers = await prisma.userVoucher.findMany({
//       where: { id: { in: userVoucherIds }, userId, isUsed: false },
//       include: { vouchers: true },
//     });
//     const voucherMap = new Map<number, UserVoucher>();
//     vouchers.forEach((voucher) => voucherMap.set(voucher.id, voucher));

//     // Debug logs
//     console.log('User:', user);
//     console.log('Products:', findProducts);
//     console.log('Discounts:', discounts);
//     console.log('Vouchers:', vouchers);

//     // Separate different types of discounts and vouchers using the helper function
//     const minPurchaseDiscounts = discounts.filter(
//       (disc) => disc.discounts.discountType === 'MIN_PURCHASE',
//     );
//     const productDiscounts = discounts.filter(
//       (disc) => disc.discounts.discountType === 'PRODUCT',
//     );

//     const productVouchers = vouchers.filter(
//       (voucher) => voucher.vouchers.voucherType === 'PRODUCT',
//     );

//     const purchaseVouchers = vouchers.filter(
//       (voucher) => voucher.vouchers.voucherType === 'PURCHASE',
//     );
//     // Create a map of discounted prices for products
//     const prodDiscMap = new Map<number, ProductDiscountMap>();
//     if (productDiscounts.length > 0) {
//       const discountPromises = findProducts.map(async (product) => {
//         const applicableDiscount = productDiscounts.find(
//           (discount) => discount.discounts.productId === product.id,
//         );

//         if (applicableDiscount) {
//           try {
//             const discountedPrice = await calculateProductDiscount(
//               product.id,
//               applicableDiscount.id,
//               userId,
//             );
//             const discountValue = product.price - discountedPrice;
//             prodDiscMap.set(product.id, {
//               originalPrice: product.price,
//               discValue: discountValue,
//               total: discountedPrice,
//             });
//           } catch (error) {
//             console.error(
//               `Error calculating discount for product ID ${product.id}:`,
//               error,
//             );
//           }
//         } else {
//           // No discount for this product, use the original price
//           prodDiscMap.set(product.id, {
//             originalPrice: product.price,
//             discValue: 0,
//             total: product.price,
//           });
//         }
//       });

//       await Promise.all(discountPromises);
//     }

//     // Create a map of vouchered prices for products
//     const prodVoucherMap = new Map<number, ProductDiscountMap>();
//     if (productVouchers.length > 0) {
//       const voucherPromises = findProducts.map(async (product) => {
//         const applicableVoucher = productVouchers.find(
//           (voucher) => voucher.vouchers.productId === product.id,
//         );

//         if (applicableVoucher) {
//           try {
//             const discountValue = applicableVoucher.vouchers.discountValue;
//             const discountedPrice = product.price - (product.price * discountValue) / 100;
//             prodVoucherMap.set(product.id, {
//               originalPrice: product.price,
//               discValue: discountValue,
//               total: discountedPrice,
//             });
//           } catch (error) {
//             console.error(
//               `Error calculating voucher for product ID ${product.id}:`,
//               error,
//             );
//           }
//         }
//       });

//       await Promise.all(voucherPromises);
//     }

//     console.log('Product Discount Map:', prodDiscMap);
//     console.log('Product Voucher Map:', prodVoucherMap);

//     // Calculate total amount for products
//     let totalAmount = 0;
//     const orderItems = products.map((product) => {
//       let finalPrice = 0;
//       let itemDiscountId: number | null = null;
//       let itemVoucherId: number | null = null;

//       const discountData = prodDiscMap.get(product.productId);
//       const voucherData = prodVoucherMap.get(product.productId);

//       if (discountData && voucherData) {
//         // If both discount and voucher are applicable, apply the voucher
//         finalPrice = voucherData.total;
//         itemDiscountId = null;  // No discountId because we applied voucher
//         itemVoucherId = userVoucherIds.find(
//           (voucherId) => voucherMap.get(voucherId)?.vouchers.productId === product.productId
//         ) || null;
//       } else if (discountData) {
//         finalPrice = discountData.total;
//         itemDiscountId = userDiscountIds.find(
//           (discountId) => discMap.get(discountId)?.discounts.productId === product.productId
//         ) || null;
//         itemVoucherId = null; // No voucherId because we applied discount
//       } else if (voucherData) {
//         finalPrice = voucherData.total;
//         itemVoucherId = userVoucherIds.find(
//           (voucherId) => voucherMap.get(voucherId)?.vouchers.productId === product.productId
//         ) || null;
//         itemDiscountId = null; // No discountId because we applied voucher
//       } else {
//         const originalProduct = productMap.get(product.productId);
//         if (originalProduct) {
//           finalPrice = originalProduct.price;
//         }
//       }

//       totalAmount += finalPrice * product.qty;
//       return {
//         productId: product.productId,
//         qty: product.qty,
//         originalPrice: productMap.get(product.productId)!.price,
//         discValue: discountData ? discountData.discValue : 0,
//         total: finalPrice * product.qty,
//         userDiscountId: itemDiscountId,
//         userVoucherId: itemVoucherId,
//       };
//     });

//     console.log('Total Amount before MIN_PURCHASE discounts:', totalAmount);

//     // Apply minimum purchase discounts
//     minPurchaseDiscounts.forEach((discount) => {
//       if (totalAmount >= discount.discounts.minPurchase!) {
//         totalAmount -= discount.discounts.discountvalue;
//       }
//     });

//     console.log('Total Amount after MIN_PURCHASE discounts:', totalAmount);

//     // Apply purchase vouchers
//     purchaseVouchers.forEach((voucher) => {
//       totalAmount -= voucher.vouchers.discountValue;
//     });

//     console.log('Total Amount after applying purchase vouchers:', totalAmount);

//     // Create the order
//     const order = await prisma.order.create({
//       data: {
//         userId,
//         storeId,
//         totalAmount,
//         userDiscountId: minPurchaseDiscounts.length > 0 ? minPurchaseDiscounts[0].id : null,
//         userVoucherId: purchaseVouchers.length > 0 ? purchaseVouchers[0].id : null,
//         OrderItems: {
//           create: orderItems,
//         },
//       },
//       include: {
//         OrderItems: true,
//       },
//     });

//     return order;
//   } catch (error) {
//     console.error(error); // Add this line to log errors
//     throw error; // Ensure errors are properly thrown
//   }
// };
