import { ExtractJwt, Strategy } from 'passport-jwt'
import {
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { UsersService } from 'src/users/users.service'
import { PassportStrategy } from '@nestjs/passport'
import { JwtPayload } from 'src/utils'
import { User } from 'src/users/user.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        try {
            const user = await this.userService.getById(payload.id)
            if (!user) {
                throw new NotFoundException()
            }
            return user
        } catch {
            throw new UnauthorizedException()
        }
    }
}
