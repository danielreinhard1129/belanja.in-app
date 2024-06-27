import { createCategoryService } from '@/services/category/create-category.service';
import { deleteCategoryService } from '@/services/category/delete-category.service';
import { getCategoriesService } from '@/services/category/get-categories.service';
import { updateCategoryService } from '@/services/category/update-category.service';
import { NextFunction, Request, Response } from 'express';
export class CategoryController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getCategoriesService();

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await createCategoryService(req.body);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await updateCategoryService(
        Number(req.params.id),
        req.body,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deleteCategoryService(Number(req.params.id));

      return res.status(200).send({
        message: 'delete category success',
      });
    } catch (error) {
      next(error);
    }
  }
}
