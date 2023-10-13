import { Module } from '@nestjs/common'
import { BooksService } from './books.service'
import { BooksController } from './books.controller'
import { Book, BookSchema } from './book.schema'
import { MongooseModule } from '@nestjs/mongoose'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    ],
    controllers: [BooksController],
    providers: [BooksService],
    exports: [BooksService],
})
export class BooksModule {}
