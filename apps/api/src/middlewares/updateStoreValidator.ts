import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
export const updateStoreValidator = [
  body('name').isLength({ min: 3 }).withMessage('name is too short').optional(),
  body('cityId').optional(),
  body('storeAdminId').optional(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
