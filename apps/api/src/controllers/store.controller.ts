import { createStoreService } from '@/services/store/create-store.service';
import { deleteStoreService } from '@/services/store/delete-store.service';
import { getStoreService } from '@/services/store/get-store.service';
import { getStoreBySuperAdminService } from '@/services/store/get-storeByStoreAdmin.service';
import { getStoresService } from '@/services/store/get-stores.service';
import { getStoresByParamsService } from '@/services/store/get-storesByParams.service';
// import { updateStoreService } from '@/services/store/update-store.service';
import { NextFunction, Request, Response } from 'express';
export class StoreController {
  async createStore(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createStoreService(req.body, res.locals.user);
      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStores(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getStoresService();

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateStore(req: Request, res: Response, next: NextFunction) {
    try {
      // const result = await updateStoreService(Number(req.params.id), req.body);
      // return res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStoresByParams(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
      };
      const result = await getStoresByParamsService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStore(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getStoreService(Number(req.params.id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStoreByStoreAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getStoreBySuperAdminService(Number(req.params.id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteStore(req: Request, res: Response, next: NextFunction) {
    try {
      await deleteStoreService(Number(req.params.id), res.locals.user);

      return res.status(200).send({
        message: 'delete store success',
      });
    } catch (error) {
      next(error);
    }
  }
}
