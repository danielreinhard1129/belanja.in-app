import { NEXT_BASE_URL } from '@/config';
import { transporter } from '@/libs/nodemailer';
import prisma from '@/prisma';
import { appConfig } from '@/utils/config';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';

export const forgotPasswordService = async (body: Pick<User, 'email'>) => {
  try {
    const { email } = body;
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new Error('Invalid email address');
    }

    const token = sign({ id: user.id }, appConfig.jwtSecretKey, {
      expiresIn: '30m',
    });

    const link = NEXT_BASE_URL + `/reset-password?token=${token}`;

    await transporter.sendMail({
      from: 'Admin',
      to: email,
      subject: 'link reset password',
      html: `<a href="${link}">Reset Password</a>`,
    });

    return {
      message: `email to reset password has been sent to ${email}`,
      email,
    };
  } catch (error) {
    throw error;
  }
};
