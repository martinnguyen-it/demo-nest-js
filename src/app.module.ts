import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { BooksModule } from './books/books.module'
import { AuthController } from './auth/auth.controller'
import { AuthModule } from './auth/auth.module'
import { UsersController } from './users/users.controller'

@Module({
    imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.DB || process.env.DB_LOCAL),
        UsersModule,
        BooksModule,
        AuthModule,
    ],
    controllers: [AuthController, UsersController],
    providers: [],
})
export class AppModule {}
