import { NEXT_BASE_URL } from '@/config';
import { transporter } from '@/libs/nodemailer';
import prisma from '@/prisma';
import { appConfig } from '@/utils/config';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export const registerService = async (body: Omit<User, 'id'>) => {
  try {
    const { email } = body;

    const user = await prisma.user.findFirst({
      where: { email },
    });

    const checkIsDelete = await prisma.user.findFirst({
      where: { email, isDelete: true },
    });

    if (user && !checkIsDelete) {
      throw new Error('email already exist');
    }

    let newUser;

    if (!user) {
      newUser = await prisma.user.create({
        data: {
          ...body,
        },
      });
    }

    if (checkIsDelete) {
      newUser = await prisma.user.update({
        where: { id: user?.id },
        data: {
          ...body,
          isDelete: false,
          isVerified: false,
        },
      });
    }

    const token = sign(
      { id: Number(newUser!.id) || user!.id },
      appConfig.jwtSecretKey,
      {
        expiresIn: '30m',
      },
    );

    const link = NEXT_BASE_URL + `/verification?token=${token}`;

    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/verify.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ name: newUser?.name, link: link });

    await transporter.sendMail({
      from: 'Admin',
      to: email,
      subject: 'Please verify your account',
      html: htmlToSend,
    });

    return {
      message: 'Register success, please check your email',
      token,
    };
  } catch (error) {
    throw error;
  }
};
