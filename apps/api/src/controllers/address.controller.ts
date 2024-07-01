import { addUserAddressService } from '@/services/address/add-user-address.service';
import { deleteUserAddressService } from '@/services/address/delete-user-address.service';
import { getUserAddressService } from '@/services/address/get-user-address.service';
import { updateUserAddressService } from '@/services/address/update-user-address.service';
import { NextFunction, Request, Response } from 'express';

export class AddressController {
  async getAddressController(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await getUserAddressService(Number(id));

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async addAddressController(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await addUserAddressService(req.body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateAddressController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const addressId = req.params.id;
      const body = req.body;

      const result = await updateUserAddressService(Number(addressId), body);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteAddressController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const addressId = req.params.id;
      const result = await deleteUserAddressService(Number(addressId));

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
