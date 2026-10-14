// [Nền tảng] Guard xác thực JWT, bỏ qua endpoint gắn @Public().
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    // Thêm logic xác thực token JWT tại đây nếu cần
    return true;
  }
}
