import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const updateAddressValidator = [
  body('addressLine')
    .isLength({ min: 8 })
    .withMessage('Address line is too short')
    .optional(),
  body('postalCode').optional(),
  body('provinceId').optional(),
  body('cityId').optional(),
  body('subdistrictId').optional(),
  body('lat').optional(),
  body('long').optional(),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
