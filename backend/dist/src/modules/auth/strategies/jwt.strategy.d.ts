import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(config: ConfigService, prisma: PrismaService);
    validate(payload: {
        sub: number;
    }): Promise<{
        id: number;
        name: string;
        email: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        loyaltyPoints: number;
    }>;
}
export {};
