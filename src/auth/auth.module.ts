import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '@src/users/users.module'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { BooksModule } from '@src/books/books.module'
import { JwtStrategy } from './strategy'

@Module({
    imports: [
        UsersModule,
        BooksModule,
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: process.env.TOKEN_EXPIRES_IN },
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
