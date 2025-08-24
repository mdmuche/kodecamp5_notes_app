import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

@Injectable()
export class SessionAuthGuard implements CanActivate {
   canActivate(context: ExecutionContext): boolean {
       const request = context.switchToHttp().getRequest<Request>();
       return request.session?.userId != null;
   }
}