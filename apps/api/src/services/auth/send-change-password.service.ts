import { NEXT_BASE_URL } from '@/config';
import { transporter } from '@/libs/nodemailer';
import prisma from '@/prisma';
import { appConfig } from '@/utils/config';
import { sign } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export const sendChangePasswordService = async (id: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      throw new Error('user not found');
    }

    const token = sign({ id: user.id }, appConfig.jwtSecretKey, {
      expiresIn: '30m',
    });

    const link =
      NEXT_BASE_URL + `/user/${user.id}/change-password?token=${token}`;

    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/reset-password.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ name: user?.name, link: link });

    await transporter.sendMail({
      from: 'Admin',
      to: user.email,
      subject: 'Reset Password',
      html: htmlToSend,
    });

    return {
      message: `email has been sent to ${user.email}`,
    };
  } catch (error) {
    throw error;
  }
};
