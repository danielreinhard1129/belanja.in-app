import prisma from '@/prisma';
import { Store } from '@prisma/client';

interface UpdateStore
  extends Partial<Omit<Store, 'id' | 'updatedAt' | 'qty' | 'createdAt'>> {
  user: {
    id: number;
  };
}

// export const updateStoreService = async (id: number, body: UpdateStore) => {
//   try {
//     const { name, city, lat, long, storeAdminId, user } = body;

//     // Check if store exists
//     const store = await prisma.store.findFirst({
//       where: { id },
//     });

//     if (!store) {
//       throw new Error('store not found');
//     }

//     const checkUser = await prisma.user.findUnique({
//       where: {
//         id: Number(user.id),
//       },
//     });

//     if (!checkUser) {
//       throw new Error("Can't find your account");
//     }

//     if (checkUser.role !== 'SUPERADMIN') throw new Error('Unauthorized access');

//     if (name) {
//       const existingStore = await prisma.store.findFirst({
//         where: {
//           name,
//           NOT: {
//             id,
//           },
//         },
//       });

//       if (existingStore) {
//         throw new Error('Name already in use');
//       }
//     }

//     // Tentukan nilai storeAdminId
//     const adminId = storeAdminId ? Number(storeAdminId) : null;

//     const updateStore = await prisma.store.update({
//       where: { id },
//       data: {
//         name: name,
//         city: city,
//         lat: lat,
//         long: long,
//         storeAdminId: adminId,
//       },
//     });

//     return { message: 'Update Store Success', data: updateStore };
//   } catch (error) {
//     throw error;
//   }
// };
