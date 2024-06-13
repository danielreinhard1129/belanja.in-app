import { NEXT_BASE_URL } from '@/config';
import { transporter } from '@/libs/nodemailer';
import prisma from '@/prisma';
import { appConfig } from '@/utils/config';
import { sign } from 'jsonwebtoken';

export const sendChangePasswordService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('user not found');
    }

    const token = sign({ id: user.id }, appConfig.jwtSecretKey, {
      expiresIn: '30m',
    });

    const link = NEXT_BASE_URL + `/user/${user.id}/change-password?token=${token}`;

    await transporter.sendMail({
      from: 'Admin',
      to: user.email,
      subject: 'link reset password',
      html: `<a href="${link}" target="_blank">Reset Password Here</a>`,
    });

    return {
      message: `email has been sent to ${user.email}`,
    };
  } catch (error) {
    throw error;
  }
};
