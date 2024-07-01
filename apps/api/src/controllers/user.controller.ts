import { getUserService } from '@/services/auth/get-user.service';
import { deleteUserService } from '@/services/user/delete-user.service';
import { getUserWithSuperAdminService } from '@/services/user/get-userWithStoreAdmin.service';
import { getUsersService } from '@/services/user/get-users.service';
import { updateUserService } from '@/services/user/update-user.service';
import { NextFunction, Request, Response } from 'express';
export class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const query = {
        take: parseInt(req.query.take as string) || 8,
        page: parseInt(req.query.page as string) || 1,
        sortBy: (req.query.sortBy as string) || 'name',
        sortOrder: (req.query.sortOrder as string) || 'desc',
        search: (req.query.search as string) || '',
        role: (req.query.role as string) || 'all',
      };
      const result = await getUsersService(query);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async getUserWithSuperAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await getUserWithSuperAdminService(Number(req.params.id));

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const result = await updateUserService(
        Number(id),
        req.body,
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await deleteUserService(
        Number(req.params.id),
        res.locals.user,
      );

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
}
