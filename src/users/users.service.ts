import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { Model } from 'mongoose'
import MongoError from 'src/utils/mongoError.enum'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async create(userData: Partial<User>) {
        try {
            const newUser = await this.userModel.create(userData)
            newUser.password = undefined
            return newUser
        } catch (error) {
            if (error?.code === MongoError.DuplicateKey) {
                throw new HttpException(
                    'User with that email already exists',
                    HttpStatus.BAD_REQUEST
                )
            }
            throw new HttpException(
                'Something went wrong',
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    getById(id: string): Promise<User> {
        return this.userModel.findById(id)
    }

    async deleteById(id: string) {
        return this.userModel.findById(id)
    }

    async findOne(props: Partial<User>, select: string) {
        const query = this.userModel.findOne(props)
        const user = select ? await query.select(select) : await query

        if (!user) {
            throw new NotFoundException()
        }

        return user
    }

    async getAll() {
        return this.userModel.find()
    }
}
