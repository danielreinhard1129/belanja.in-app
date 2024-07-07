import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const createProductValidator = [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ min: 3 })
    .withMessage('name is too short'),
  body('description').notEmpty().withMessage('description is required'),
  body('price')
    .isInt()
    .withMessage('Price must be a number')
    .notEmpty()
    .withMessage('price is required'),
  body('weight')
    .isInt()
    .withMessage('Weight must be a number')
    .notEmpty()
    .withMessage('weight is required'),
  body('categories').notEmpty().withMessage('categories is required'),
  body('user').notEmpty().withMessage('user is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
