import { getAddressByUserIdService } from '@/services/address/get-address-by-user-id.service';
import { NextFunction, Request, Response } from 'express';

export class AddressController {
  async getAddressByUserIdController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { user } = req.body;
      const result = await getAddressByUserIdService(user);
      console.log(req.body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
