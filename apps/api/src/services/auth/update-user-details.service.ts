import prisma from '@/prisma';
import { User } from '@prisma/client';

export const updateUserDetailsService = async (
  body: Pick<User, 'email' | 'name' | 'gender' | 'birthDate'>,
  userId: number,
) => {
  try {
    const { email, name, gender, birthDate } = body;

    console.log('Incoming body:', body);

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (email !== user.email) {
      const userEmail = await prisma.user.findFirst({
        where: { email: { equals: email } },
      });
      if (userEmail) {
        throw new Error('Email already in use');
      }
    }

    const formattedBirthDate = birthDate ? new Date(birthDate) : null;

    const userDetails = await prisma.user.update({
      where: { id: userId },
      data: {
        email,
        name,
        gender,
        birthDate: formattedBirthDate,
      },
    });

    return {
      message: 'update user details success',
      data: userDetails,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
