import { NEXT_BASE_URL } from '@/config';
import { transporter } from '@/libs/nodemailer';
import prisma from '@/prisma';
import { appConfig } from '@/utils/config';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';

export const registerService = async (body: Omit<User, 'id'>) => {
  try {
    const { email } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      throw new Error('email already exist');
    }

    const newUser = await prisma.user.create({
      data: {
        ...body,
      },
    });

    const token = sign({ id: newUser.id || user!.id }, appConfig.jwtSecretKey, {
      expiresIn: '30m'
    });

    const link = NEXT_BASE_URL + `/verification?token=${token}`;

    await transporter.sendMail({
      from: 'Admin',
      to: email,
      subject: 'Please verify your account',
      html: `<a href="${link}" target="_blank">Verify</a>`,
    });

    return {
      message: 'Register success, please check your email',
      token,
    };
  } catch (error) {
    throw error;
  }
};
