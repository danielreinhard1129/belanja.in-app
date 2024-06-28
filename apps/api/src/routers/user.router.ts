import { UserController } from '@/controllers/user.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', this.userController.getUsers);
    this.router.get('/user', this.userController.getUserNotStoreAdmin);
    this.router.get('/:id', this.userController.getUser);
    this.router.delete('/:id', verifyToken, this.userController.deleteUser);
  }

  getRouter(): Router {
    return this.router;
  }
}
