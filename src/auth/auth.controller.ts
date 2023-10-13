import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Post,
} from '@nestjs/common'
import LogInDto from './dto/logIn.dto'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import { UsersService } from '@src/users/users.service'
import { User } from '@src/users/user.schema'
import { comparePassword } from '@src/utils/comparePassword'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async logIn(@Body() loginDt: LogInDto) {
        const { email, password } = loginDt

        let user: User
        try {
            user = await this.usersService.findOne({ email }, '+password')
            if (!user) {
                throw new NotFoundException()
            }
        } catch (error) {
            if (error.status === 404) throw error
            else throw new InternalServerErrorException()
        }

        const check = await comparePassword(password, user.password)
        if (!check) {
            throw new NotFoundException('Email or password not match')
        }

        const token = await this.authService.signToken(user._id)

        user.password = undefined
        return { data: user, token }
    }

    @Post('register')
    async register(@Body() user: RegisterDto) {
        const { email, password, fullName } = user

        const newUser = await this.usersService.create({
            email,
            password,
            fullName,
        })

        if (!user) {
            throw new InternalServerErrorException()
        }

        const token = await this.authService.signToken(newUser._id)

        newUser.password = undefined
        return { data: newUser, token }
    }
}
