import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const updateProductValidator = [
  body('name').isLength({ min: 3 }).optional(),
  body('description').optional(),
  body('price').isInt().withMessage('Price must be a number').optional(),
  body('weight').isInt().withMessage('Weight must be a number').optional(),
  body('categories').optional(),
  body('user').notEmpty().withMessage('user is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
