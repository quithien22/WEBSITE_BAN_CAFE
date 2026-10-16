import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPassword } from './dto/reset-password.dto';
export declare function ThongTinKH(user: User): {
    id: number;
    name: string;
    email: string;
    phone: string;
    role: import(".prisma/client").$Enums.Role;
    loyaltyPoints: number;
};
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    private readonly config;
    private readonly logger;
    constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService);
    private signToken;
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
}
