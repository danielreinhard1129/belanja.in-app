import { AuthController } from '@/controllers/auth.controller';
import { verifyToken } from '@/middlewares/verifyToken';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/:id', this.authController.getUserController);
    this.router.post('/register', this.authController.registerController);
    this.router.post('/login', this.authController.loginController);
    this.router.patch(
      '/verify',
      verifyToken,
      this.authController.verifyController,
    );
    this.router.post(
      '/login/google',
      this.authController.loginWithGoogleController,
    );
    this.router.post(
      '/send-change-password',
      this.authController.sendChangePasswordController,
    );
    this.router.patch(
      '/change-password',
      verifyToken,
      this.authController.changePasswordController,
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
