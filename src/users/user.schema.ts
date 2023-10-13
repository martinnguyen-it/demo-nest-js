import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Transform, Type } from 'class-transformer'
import { ObjectId } from 'mongoose'
import { hash } from 'bcrypt'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { Book } from 'src/books/book.schema'

export type UserDocument = User & Document

@Schema()
export class User {
    @Transform(({ value }) => value.toString())
    _id: ObjectId

    @IsNotEmpty()
    @IsEmail()
    @Prop({ unique: true })
    email: string

    @IsNotEmpty()
    @Prop()
    fullName: string

    @IsOptional()
    @IsEnum(['admin', 'user'])
    @Prop({ default: 'user' })
    role: 'admin' | 'user'

    @IsNotEmpty()
    @Prop({ select: false })
    password: string

    @Type(() => Book)
    books: Book[]
}

const UserSchema = SchemaFactory.createForClass(User)

UserSchema.index({ email: 1 }, { unique: true })

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next()
    this.password = await hash(this.password, 12)
    next()
})

UserSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'author',
})

export { UserSchema }
