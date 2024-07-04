import { AuthController } from '@/controllers/auth.controller';
import { uploader } from '@/libs/uploader';
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
    this.router.get('/:id', verifyToken, this.authController.getUserController);
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
      verifyToken,
      this.authController.sendChangePasswordController,
    );
    this.router.patch(
      '/change-password',
      verifyToken,
      this.authController.changePasswordController,
    );
    this.router.post(
      '/forgot-password',
      this.authController.forgotPasswordController,
    );
    this.router.patch(
      '/reset-password',
      verifyToken,
      this.authController.resetPasswordController,
    );
    this.router.patch(
      '/update-user-details/:id',
      uploader('IMG', '/images').array('avatarUrl', 1),
      this.authController.updateUserDetailsController,
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
