import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Schema } from 'mongoose'

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService) {}

    async signToken(id: Schema.Types.ObjectId) {
        return this.jwtService.sign(
            { id },

            {
                expiresIn: process.env.TOKEN_EXPIRES_IN,
                secret: process.env.JWT_SECRET_KEY,
            }
        )
    }
}
