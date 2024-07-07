import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

export const addAddressValidator = [
  body('addressLine')
    .notEmpty()
    .withMessage('Address line is required')
    .isLength({ min: 8 })
    .withMessage('Address line is too short'),
  body('postalCode').notEmpty().withMessage('Postal Code is required'),
  body('provinceId').notEmpty().withMessage('Province is required'),
  body('cityId').notEmpty().withMessage('City is required'),
  body('subdistrictId').notEmpty().withMessage('Subdistrict is required'),
  body('lat').notEmpty().withMessage('Latitude is required'),
  body('long').notEmpty().withMessage('Longitude is required'),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() });
    }

    next();
  },
];
