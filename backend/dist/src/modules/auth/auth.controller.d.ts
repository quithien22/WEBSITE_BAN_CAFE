import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPassword } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
            loyaltyPoints: number;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto): Promise<{
        user: {
            id: number;
            name: string;
            email: string;
            phone: string;
            role: import(".prisma/client").$Enums.Role;
            loyaltyPoints: number;
        };
        accessToken: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(dto: ResetPassword): Promise<{
        message: string;
    }>;
    me(req: {
        user: unknown;
    }): unknown;
}
