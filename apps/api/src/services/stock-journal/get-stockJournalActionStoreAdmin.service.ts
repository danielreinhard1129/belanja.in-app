// import prisma from '@/prisma';
// import { PaginationQueryParams } from '@/types/pagination.type';

// interface GetStockJournalsByFilter extends PaginationQueryParams {
//   search?: string;
//   status?: string;
// }

// interface UserToken {
//   id: number;
// }

// export const getStockJournalActionStoreAdminService = async (
//   userToken: UserToken,
//   query: GetStockJournalsByFilter,
// ) => {
//   const { take, page, status } = query;
//   const userId = Number(userToken.id);

//   const user = await prisma.user.findFirst({
//     where: {
//       id: userId,
//     },
//     include: {
//       storeAdmin: {
//         include: {
//           stores: true,
//         },
//       },
//     },
//   });

//   if (!user) {
//     throw new Error("Can't find your account");
//   }

//   if (user.role === 'USER') {
//     throw new Error('You do not have access');
//   }

//   const storeId = user.storeAdmin?.stores?.id;

//   if (!storeId) {
//     throw new Error('No store found for this user');
//   }

//   let where: any = {
//     type: 'MUTATION',
//     JournalDetail: {
//       some: {
//         toStoreId: {
//           not: null,
//         },
//       },
//     },
//     OR: [
//       { storeId },
//       { toStoreId: storeId },
//       { fromStoreId: storeId },
//       {
//         JournalDetail: {
//           some: {
//             toStoreId: storeId,
//           },
//         },
//       },
//       {
//         JournalDetail: {
//           some: {
//             stockJournal: {
//               fromStoreId: storeId,
//             },
//           },
//         },
//       },
//     ],
//   };

//   // Filter berdasarkan status jika didefinisikan
//   if (status && status !== 'all') {
//     where.status = status;
//   }

//   try {
//     const stockJournal = await prisma.stockJournal.findMany({
//       where,
//       include: {
//         product: true,
//         store: true,
//         JournalDetail: {
//           include: {
//             toStore: true,
//           },
//         },
//       },
//       skip: (page - 1) * take,
//       take,
//     });

//     if (!stockJournal.length) {
//       throw new Error('No stockJournal found');
//     }

//     const count = await prisma.stockJournal.count({ where });

//     return {
//       data: stockJournal,
//       meta: { page, take, total: count },
//     };
//   } catch (error) {
//     throw error;
//   }
// };
