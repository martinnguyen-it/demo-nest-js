import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Transform, Type } from 'class-transformer'
import mongoose, { ObjectId } from 'mongoose'
import { IsNotEmpty } from 'class-validator'
import { User } from '@src/users/user.schema'
import slugify from 'slugify'
import * as moment from 'moment'

export type BookDocument = Book & Document

@Schema({ timestamps: true })
export class Book {
    @Transform(({ value }) => value.toString())
    _id: ObjectId

    @Prop()
    @IsNotEmpty()
    title: string

    @Prop()
    alias: string

    @Prop()
    @IsNotEmpty()
    content: string

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    @Type(() => User)
    author: ObjectId
}

const BookSchema = SchemaFactory.createForClass(Book)

BookSchema.index({ alias: 1 }, { unique: true })

BookSchema.pre('save', async function (next) {
    const date = new Date()
    this.alias = await `${slugify(this.title, { lower: true })}-${moment(
        date
    ).format('DDHHmmss')}`
    next()
})

export { BookSchema }
