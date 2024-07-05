import { addUserAddressService } from '@/services/address/add-user-address.service';
import { deleteUserAddressService } from '@/services/address/delete-user-address.service';
import { getAddressByIdService } from '@/services/address/get-address-by-id.service';
import { getCitiesByProvinceIdService } from '@/services/address/get-cities.service';
import { getProvincesService } from '@/services/address/get-provinces.service';
import { getSubdistrictsService } from '@/services/address/get-subdistricts.service';
import { getUserAddressService } from '@/services/address/get-user-address.service';
import { updateUserAddressService } from '@/services/address/update-user-address.service';
import { NextFunction, Request, Response } from 'express';

export class AddressController {
  async getAddressesController(req: Request, res: Response, next: NextFunction) {
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

      console.log('body', body);

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

  async getProvincesController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 34,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'id',
        sortOrder: (req.query.sortOrder as string) || 'asc',
        search: (req.query.search as string) || '',
      };
      const result = await getProvincesService(query);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getCitiesController(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 38,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'id',
        sortOrder: (req.query.sortOrder as string) || 'asc',
        provinceId: parseInt(req.query.provinceId as string),
      };

      if (!query.provinceId) {
        return res.status(400).json({ error: 'provinceId is required' });
      }

      const result = await getCitiesByProvinceIdService(query);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getSubdistrictsController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 47,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'id',
        sortOrder: (req.query.sortOrder as string) || 'asc',
        cityId: parseInt(req.query.cityId as string),
      };

      if (!query.cityId) {
        return res.status(400).json({ error: 'cityId is required' });
      }

      const result = await getSubdistrictsService(query);

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getAddressByIdController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const addressId = req.params.id;
      const result = await getAddressByIdService(Number(addressId));

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
