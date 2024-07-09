import { NEXT_BASE_URL } from '@/config';
import { transporter } from '@/libs/nodemailer';
import prisma from '@/prisma';
import { appConfig } from '@/utils/config';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

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
      message: `email to reset password has been sent to ${email}`,
      email,
    };
  } catch (error) {
    throw error;
  }
};
