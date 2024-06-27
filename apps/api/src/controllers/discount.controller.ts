import { getDiscountsByStoreAdminService } from '@/services/discount/get-discountsByStoreAdmin.service';
import { getDiscountsBySuperAdminService } from '@/services/discount/get-discountsBySuperAdmin.service';
import { NextFunction, Request, Response } from 'express';
export class DiscountController {
  async getDiscountsBySuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        storeId: (req.query.storeId as string) || undefined,
      };
      const result = await getDiscountsBySuperAdminService(
        query,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getDiscountsByStoreAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getDiscountsByStoreAdminService(res.locals.user);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
