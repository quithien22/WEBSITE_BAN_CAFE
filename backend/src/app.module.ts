// [Nền tảng] Module gốc: import Config, Prisma và toàn bộ module nghiệp vụ.
// src/app.module.ts
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { ProductsModule } from "./modules/products/products.module";
import { ToppingsModule } from "./modules/toppings/toppings.module";
import { UsersModule } from "./modules/users/users.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { CartModule } from "./modules/cart/cart.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    ProductsModule,
    ToppingsModule,
    UsersModule,
    OrdersModule,
    CartModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}