import { AuthController } from '@/controllers/auth.controller';
import { uploader } from '@/libs/uploader';
import { forgotPasswordValidator } from '@/middlewares/forgotPasswordValidator';
import { loginValidator } from '@/middlewares/loginValidator';
import { registerValidator } from '@/middlewares/registerValidator';
import { resetPasswordValidator } from '@/middlewares/resetPasswordValidator';
import { updateUserDetailsValidator } from '@/middlewares/updateUserDetailsValidator';
import { verificationValidator } from '@/middlewares/verificationValidator';
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
    this.router.post(
      '/register',
      registerValidator,
      this.authController.registerController,
    );
    this.router.post(
      '/login',
      loginValidator,
      this.authController.loginController,
    );
    this.router.patch(
      '/verify',
      verifyToken,
      verificationValidator,
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
      forgotPasswordValidator,
      this.authController.forgotPasswordController,
    );
    this.router.patch(
      '/reset-password',
      verifyToken,
      resetPasswordValidator,
      this.authController.resetPasswordController,
    );
    this.router.patch(
      '/update-user-details/:id',
      updateUserDetailsValidator,
      uploader('IMG', '/images').array('avatarUrl', 1),
      this.authController.updateUserDetailsController,
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
