import { CategoryController } from '@/controllers/category.controller';
import { Router } from 'express';

export class CategoryRouter {
  private router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.categoryController.getCategories);
    this.router.post('/', this.categoryController.createCategory);
    this.router.patch('/:id', this.categoryController.updateCategory);
    this.router.delete('/:id', this.categoryController.deleteCategory);
  }

  getRouter(): Router {
    return this.router;
  }
}
