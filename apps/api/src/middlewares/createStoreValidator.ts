import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
export const createStoreValidator = [
  body('name')
    .notEmpty()
    .withMessage('name is required')
    .isLength({ min: 3 })
    .withMessage('name is too short'),
  body('cityId').notEmpty().withMessage('city is required'),
  body('storeAdminId').optional(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
