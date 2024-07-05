import { hashPassword } from '@/libs/bcrypt';
import { transporter } from '@/libs/nodemailer';
import fs from 'fs';
import path from 'path';
import prisma from '@/prisma';
import Handlebars from 'handlebars';

export const verifyService = async (userId: number, password: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof password !== 'string') {
      throw new Error('password must be string');
    }

    const hashedPassword = await hashPassword(password);

    const verifyUser = await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        isVerified: true,
      },
    });

    const emailTemplatePath = path.join(__dirname, '../../templates/welcome.hbs');
    
    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ name: user.name });

    await transporter.sendMail({
      from: 'Admin',
      to: user.email,
      subject: 'Welcome to Belanjain!',
      html: htmlToSend,
    });

    return {
      message: 'Thanks, your email has been verified',
      data: verifyUser,
    };
  } catch (error) {
    console.error('Error in verifyService:', error);
    throw error;
  }
};
