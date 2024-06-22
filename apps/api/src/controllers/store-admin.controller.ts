import { NextFunction, Request, Response } from 'express';
import { getStoreAdminService } from '@/services/store-admin/get-store-admin.service';
import { getStoreAdminsService } from '@/services/store-admin/get-store-admins.service';

export class StoreAdminController {
  async getStoreAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getStoreAdminsService();

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStoreAdminById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await getStoreAdminService(Number(id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
