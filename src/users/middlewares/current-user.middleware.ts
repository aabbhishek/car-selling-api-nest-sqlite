import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../users.entities';
import { UsersService } from '../users.service';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const { id } = req.session || {};

    if (id) {
      const user = await this.usersService.findOne(id);

      req.currentUser = user;
    }

    next();
  }
}
