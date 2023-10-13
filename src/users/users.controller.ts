import {
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Request,
    UseGuards,
} from '@nestjs/common'
import { UsersService } from './users.service'
import { ParamsWithId } from '@src/utils/paramsWithId'
import { MyJwtGuard } from '@src/auth/guard'

@Controller('user')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getAll() {
        try {
            const users = await this.usersService.getAll()
            return users
        } catch (err) {
            throw new InternalServerErrorException()
        }
    }

    @UseGuards(MyJwtGuard)
    @Get('me')
    getProfile(@Request() req) {
        return req.user
    }

    @Get(':id')
    async getUserById(@Param() { id }: ParamsWithId) {
        try {
            const user = await this.usersService.getById(id)
            if (!user) {
                throw new NotFoundException()
            }

            return { data: user }
        } catch (error) {
            if (error.status === 404) throw error
            else throw new InternalServerErrorException()
        }
    }

    @UseGuards(MyJwtGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async deleteUser(@Param() { id }: ParamsWithId) {
        try {
            const user = await this.usersService.deleteById(id)
            if (!user) {
                throw new NotFoundException()
            }
            return null
        } catch (error) {
            if (error.status === 404) throw error
            else throw new InternalServerErrorException()
        }
    }
}
