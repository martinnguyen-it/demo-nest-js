import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './user.schema'
import { Model } from 'mongoose'
import MongoError from '@src/utils/mongoError.enum'

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

    deleteById(id: string) {
        return this.userModel.findById(id)
    }

    findOne(props: Partial<User>, select: string) {
        let query = this.userModel.findOne(props)
        query = select ? query.select(select) : query

        return query
    }

    getAll() {
        return this.userModel.find()
    }
}
