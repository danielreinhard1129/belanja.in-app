import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const forgotPasswordValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required.')
    .custom(async (value) => {
      const findUser = await prisma.user.findFirst({
        where: { email: value },
      });
      if (!findUser) {
        throw new Error('User not found!');
      }
    }),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
