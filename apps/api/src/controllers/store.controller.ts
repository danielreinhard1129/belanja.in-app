import { getStoresByEmployeeOrAdminService } from '@/services/store/get-storesByEmployeeOrAdmin.service';
import { getStoresService } from '@/services/store/get-stores.service';
import { createStoreService } from '@/services/store/create-store.service';
import { NextFunction, Request, Response } from 'express';
export class StoreController {
  async createStore(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createStoreService(req.body);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStores(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
      };
      const result = await getStoresService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getStoresByEmployeeOrAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = req.params.id;
      const result = await getStoresByEmployeeOrAdminService(Number(id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
