import { createDiscountService } from '@/services/discount/create-discount.service';
import { deleteDiscountService } from '@/services/discount/delete-discount.service';
import { getDiscountService } from '@/services/discount/get-discount.service';
import { getDiscountsByStoreAdminService } from '@/services/discount/get-discountsByStoreAdmin.service';
import { getDiscountsBySuperAdminService } from '@/services/discount/get-discountsBySuperAdmin.service';
import { updateDiscountService } from '@/services/discount/update-discount.service';
import { NextFunction, Request, Response } from 'express';
export class DiscountController {
  async getDiscountsBySuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'title',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        storeId: (req.query.storeId as string) || 'all',
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
      const query = {
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'title',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        discountType: (req.query.discountType as string) || 'all',
      };
      const result = await getDiscountsByStoreAdminService(
        query,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async createDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createDiscountService(req.body, res.locals.user);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async getDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getDiscountService(Number(req.params.id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await updateDiscountService(
        Number(id),
        req.body,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async deleteDiscount(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deleteDiscountService(
        Number(req.params.id),
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
