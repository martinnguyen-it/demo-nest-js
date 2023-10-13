import { Injectable } from '@nestjs/common'
import { Book, BookDocument } from './book.schema'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import APIFeatures, { IQueryString } from '@src/common/apiFeatures'

@Injectable()
export class BooksService {
    constructor(
        @InjectModel(Book.name) private bookModel: Model<BookDocument>
    ) {}

    async getAll(query: IQueryString) {
        const books = new APIFeatures(
            this.bookModel.find().populate('author', 'fullName role'),
            query
        )
            .limitFields()
            .filter()
            .sort()
            .pagination()

        return books.query
    }

    async create(bookData: Partial<Book>) {
        return this.bookModel.create(bookData)
    }

    async getOne(props: Partial<Book | { _id: string }>) {
        return this.bookModel.findOne(props)
    }

    async deleteById(id: string) {
        return this.bookModel.findByIdAndDelete(id)
    }
}
