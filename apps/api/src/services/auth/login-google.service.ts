import { transporter } from '@/libs/nodemailer';
import prisma from '@/prisma';
import { appConfig } from '@/utils/config';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';

export const loginWithGoogleService = async (body: Omit<User, 'id'>) => {
  try {
    const { email, name } = body;

    let user = await prisma.user.findFirst({
      where: { email },
    });

    let newUser: User | undefined;

    if (!user) {
      newUser = await prisma.user.create({
        data: {
          ...body,
          name: name,
          isVerified: true,
        },
      });

      await transporter.sendMail({
        from: 'Admin',
        to: email,
        subject: 'Welcome to belanja.in',
        html: `<p>Welcome to belanja.in</p>`,
      });
    }

    const token = sign({ id: newUser ? Number(newUser.id) : undefined }, appConfig.jwtSecretKey, {
      expiresIn: '2h',
    });

    return {
      message: 'Success login by google',
      data: newUser || user,
      token,
    };
  } catch (error) {
    throw error;
  }
};
