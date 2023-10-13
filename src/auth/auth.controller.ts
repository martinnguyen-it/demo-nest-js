import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import LogInDto from './dto/logIn.dto'
import { AuthService } from './auth.service'
import RegisterDto from './dto/register.dto'
import { UsersService } from 'src/users/users.service'

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    logIn(@Body() user: LogInDto) {
        return this.authService.logIn(user)
    }

    @Post('register')
    register(@Body() user: RegisterDto) {
        const { email, password, fullName } = user
        return this.authService.register({
            email,
            password,
            fullName,
        })
    }
}
