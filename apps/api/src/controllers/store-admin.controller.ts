import { getStoreAdminService } from '@/services/store-admin/get-store-admin.service';
import { getStoreAdminsService } from '@/services/store-admin/get-store-admins.service';
import { getStoreAdminsNoStoreService } from '@/services/store-admin/get-store-adminsNoStore.service';
import { createStoreAdminService } from '@/services/store-admin/create-storeAdmin.service';
import { NextFunction, Request, Response } from 'express';
import { updateStoreAdminService } from '@/services/store-admin/update-storeAdmin.service';

export class StoreAdminController {
  async getStoreAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getStoreAdminsService();

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getStoreAdminsNoStore(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getStoreAdminsNoStoreService();

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

  async createStoreAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createStoreAdminService(req.body, res.locals.user);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async updateStoreAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await updateStoreAdminService(
        Number(id),
        req.body,
        res.locals.user,
      );
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
