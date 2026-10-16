import {
    BadRequestException,
    ConflictException,
    Injectable,
    Logger,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import type { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';

import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPassword } from './dto/reset-password.dto';

// Chỉ trả về những field an toàn cho client (tuyệt đối KHÔNG trả passwordHash / resetTokenHash)
export function ThongTinKH(user: User) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
    };
}

const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

// Luôn trả cùng một thông điệp dù email có tồn tại hay không
// -> kẻ xấu không dò được email nào đã đăng ký (chống user enumeration)
const FORGOT_PASSWORD_MESSAGE =
    'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
    ) { }

    // Tạo JWT: sub = id người dùng, role dùng để phân quyền sau này
    private signToken(user: User) {
        return this.jwt.sign({ sub: user.id, role: user.role });
    }

    async register(dto: RegisterDto) {
        const existed = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existed) throw new ConflictException('Email đã được sử dụng');

        let user: User;
        try {
            user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,
                    passwordHash: await bcrypt.hash(dto.password, 10),
                },
            });
        } catch (e) {
            // Hai request đăng ký cùng email gửi gần như đồng thời:
            // cả hai cùng qua được bước kiểm tra ở trên, DB (unique) sẽ chặn request thứ hai
            if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new ConflictException('Email đã được sử dụng');
            }
            throw e;
        }

        this.logger.log(`Đăng ký mới: ${user.email}`);
        return { user: ThongTinKH(user), accessToken: this.signToken(user) };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        const ok = user && (await bcrypt.compare(dto.password, user.passwordHash));
        // Cùng một thông báo cho "sai email" và "sai mật khẩu" để không lộ email nào tồn tại
        if (!ok) throw new UnauthorizedException('Email hoặc mật khẩu không đúng');

        return { user: ThongTinKH(user), accessToken: this.signToken(user) };
    }

    async forgotPassword(dto: ForgotPasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (user) {
            // Token gốc chỉ gửi cho người dùng, DB chỉ lưu bản băm (lộ DB cũng không dùng được)
            const rawToken = randomBytes(32).toString('hex');
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    resetTokenHash: sha256(rawToken),
                    resetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // hết hạn sau 15 phút
                },
            });

            // Chưa có dịch vụ gửi mail: tạm log link ra console để test
            const frontend =
                this.config.get<string>('FRONTEND_URL')?.split(',')[0] ??
                'http://localhost:3000';
            this.logger.log(
                `Link đặt lại mật khẩu: ${frontend}/reset-password?token=${rawToken}`,
            );
        }

        // Trả message cho cả hai trường hợp (trước đây nhánh "không có user" trả về undefined
        // làm frontend đọc res.message bị lỗi)
        return { message: FORGOT_PASSWORD_MESSAGE };
    }

    async resetPassword(dto: ResetPassword) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetTokenHash: sha256(dto.token),
                resetTokenExpiresAt: { gt: new Date() },
            },
        });
        if (!user) {
            throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
        }

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: await bcrypt.hash(dto.newPassword, 10),
                // Xóa token -> mỗi link chỉ dùng được một lần
                resetTokenHash: null,
                resetTokenExpiresAt: null,
            },
        });

        return { message: 'Đặt lại mật khẩu thành công' };
    }
}
