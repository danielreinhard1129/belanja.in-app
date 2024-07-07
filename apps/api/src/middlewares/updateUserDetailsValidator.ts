import prisma from '@/prisma';
import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const updateUserDetailsValidator = [
  body('name').isLength({ min: 4 }).withMessage('Name is too short').optional(),
  body('gender').optional(),
  body('birthDate').optional(),
  body('email')
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
