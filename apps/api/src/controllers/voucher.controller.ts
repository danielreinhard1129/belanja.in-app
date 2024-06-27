import { getVouchersByStoreAdminService } from '@/services/voucher/get-vouchersByStoreAdmin.service';
import { getVouchersBySuperAdminService } from '@/services/voucher/get-vouchersBySuperAdmin.service';
import { NextFunction, Request, Response } from 'express';
export class VoucherController {
  async getVouchersBySuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        storeId: (req.query.storeId as string) || undefined,
      };
      const result = await getVouchersBySuperAdminService(
        query,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getVouchersByStoreAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await getVouchersByStoreAdminService(res.locals.user);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
