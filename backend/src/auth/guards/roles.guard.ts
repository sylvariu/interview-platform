import {CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException} from "@nestjs/common";
import { Role } from "@prisma/client";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiedRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiedRoles) {
            return true;
        }

        const user = context.switchToHttp().getRequest().user;
        if (!user) {
            throw new UnauthorizedException('Пользователь не авторизован');
        }

        const hasRole = requiedRoles.some((role) => user.role === role);
        if (!hasRole) {
            throw new ForbiddenException('Недостаточно прав');
        }

        return true;
    }
}