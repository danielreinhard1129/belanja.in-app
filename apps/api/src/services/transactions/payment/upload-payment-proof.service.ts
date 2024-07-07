import prisma from '@/prisma';
import { join } from 'path';
import fs from 'fs';

const defaultDir = '../../../public/images';

export const uploadPaymentProofService = async (
  userId: number,
  orderId: number,
  file?: Express.Multer.File,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found!');
    }

    const payment = await prisma.payment.findFirst({ where: { orderId } });
    if (!payment) {
      throw new Error('Order not found!');
    }

    let paymentProof = payment.paymentProof;
    if (file) {
      paymentProof = `/images/${file.filename}`;
    }
    const uploadProof = await prisma.$transaction(async (tx) => {
      const data = await tx.payment.update({
        where: { id: payment.id },
        data: { paymentProof },
      });

      const updateOrderStatus = await tx.order.update({
        where: { id: orderId },
        data: { status: 'WAITING_ADMIN_CONFIRMATION' },
      });
      return data;
    });

    return { data: uploadProof, message: 'Payment proof upload success!' };
  } catch (error) {
    if (file) {
      const imagePath = join(__dirname, defaultDir, file.filename);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    throw error;
  }
};
