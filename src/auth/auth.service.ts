import { Injectable, NotFoundException } from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import LogInDto from './dto/logIn.dto'
import { JwtService } from '@nestjs/jwt'
import { comparePassword } from 'src/utils/comparePassword'
import { Schema } from 'mongoose'
import { User } from 'src/users/user.schema'

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private readonly jwtService: JwtService
    ) {}

    async signToken(id: Schema.Types.ObjectId) {
        return this.jwtService.sign(
            { id },

            {
                expiresIn: process.env.TOKEN_EXPIRES_IN,
                secret: process.env.JWT_SECRET_KEY,
            }
        )
    }

    async logIn({ email, password }: LogInDto) {
        const user = await this.usersService.findOne({ email }, '+password')
        const check = await comparePassword(password, user.password)
        if (!check) {
            throw new NotFoundException('Email or password not match')
        }

        const token = await this.signToken(user._id)

        user.password = undefined
        return { user, token }
    }

    async register(userData: Partial<User>) {
        const newUser = await this.usersService.create(userData)
        const token = await this.signToken(newUser._id)

        newUser.password = undefined
        return { data: newUser, token }
    }
}
