import { comparePassword } from '@/libs/bcrypt';
import prisma from '@/prisma';
import { appConfig } from '@/utils/config';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';

export const loginService = async (body: Pick<User, 'email' | 'password'>) => {
  try {
    const { email, password } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new Error('incorrect email address or password');
    }

    const isPasswordValid = await comparePassword(
      String(password),
      String(user.password),
    );

    if (!isPasswordValid) {
      throw new Error('incorrect email address or password');
    }

    const token = sign({ id: user.id }, appConfig.jwtSecretKey, {
      expiresIn: '2h',
    });

    return {
      message: 'Login success',
      data: user,
      token,
    };
  } catch (error) {
    throw error;
  }
};
