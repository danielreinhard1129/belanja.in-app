import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const registerValidator = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email')
    .notEmpty()
    .withMessage('Email is required.')
    .custom(async (value) => {
      const existingUser = await prisma.user.findFirst({
        where: { email: value },
      });
      if (existingUser) {
        throw new Error('Email already in use');
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
