"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
exports.ThongTinKH = ThongTinKH;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const client_1 = require("@prisma/client");
const bcrypt = require("bcryptjs");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../../prisma/prisma.service");
function ThongTinKH(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        loyaltyPoints: user.loyaltyPoints,
    };
}
const sha256 = (s) => (0, crypto_1.createHash)('sha256').update(s).digest('hex');
const FORGOT_PASSWORD_MESSAGE = 'Nếu email tồn tại, hướng dẫn đặt lại mật khẩu đã được gửi.';
let AuthService = AuthService_1 = class AuthService {
    constructor(prisma, jwt, config) {
        this.prisma = prisma;
        this.jwt = jwt;
        this.config = config;
        this.logger = new common_1.Logger(AuthService_1.name);
    }
    signToken(user) {
        return this.jwt.sign({ sub: user.id, role: user.role });
    }
    async register(dto) {
        const existed = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existed)
            throw new common_1.ConflictException('Email đã được sử dụng');
        let user;
        try {
            user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,
                    passwordHash: await bcrypt.hash(dto.password, 10),
                },
            });
        }
        catch (e) {
            if (e instanceof client_1.Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
                throw new common_1.ConflictException('Email đã được sử dụng');
            }
            throw e;
        }
        this.logger.log(`Đăng ký mới: ${user.email}`);
        return { user: ThongTinKH(user), accessToken: this.signToken(user) };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        const ok = user && (await bcrypt.compare(dto.password, user.passwordHash));
        if (!ok)
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        return { user: ThongTinKH(user), accessToken: this.signToken(user) };
    }
    async forgotPassword(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (user) {
            const rawToken = (0, crypto_1.randomBytes)(32).toString('hex');
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    resetTokenHash: sha256(rawToken),
                    resetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000),
                },
            });
            const frontend = this.config.get('FRONTEND_URL')?.split(',')[0] ??
                'http://localhost:3000';
            this.logger.log(`Link đặt lại mật khẩu: ${frontend}/reset-password?token=${rawToken}`);
        }
        return { message: FORGOT_PASSWORD_MESSAGE };
    }
    async resetPassword(dto) {
        const user = await this.prisma.user.findFirst({
            where: {
                resetTokenHash: sha256(dto.token),
                resetTokenExpiresAt: { gt: new Date() },
            },
        });
        if (!user) {
            throw new common_1.BadRequestException('Token không hợp lệ hoặc đã hết hạn');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                passwordHash: await bcrypt.hash(dto.newPassword, 10),
                resetTokenHash: null,
                resetTokenExpiresAt: null,
            },
        });
        return { message: 'Đặt lại mật khẩu thành công' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map