import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    InternalServerErrorException,
    NotFoundException,
    Param,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common'
import { BooksService } from './books.service'
import { Book } from './book.schema'
import { ParamsWithId } from '@src/utils/paramsWithId'
import { IQueryString } from '@src/common/apiFeatures'
import { MyJwtGuard } from '@src/auth/guard'

@Controller('book')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @Get()
    async getAll(@Query() query: IQueryString) {
        try {
            const books = await this.booksService.getAll(query)
            return books
        } catch (err) {
            throw new InternalServerErrorException()
        }
    }

    @Get(':alias')
    async getByAlias(@Param() alias) {
        try {
            const books = await this.booksService.getOne(alias)
            if (!books) {
                throw new NotFoundException()
            }
            return { data: books }
        } catch (error) {
            if (error.status === 404) throw error
            throw new InternalServerErrorException()
        }
    }

    @UseGuards(MyJwtGuard)
    @Post('create')
    async createBooks(@Request() req, @Body() bookData: Book) {
        try {
            const { title, content } = bookData
            const newBook = await this.booksService.create({
                title,
                author: req.user._id,
                content,
            })
            return { data: newBook }
        } catch (error) {
            throw new InternalServerErrorException()
        }
    }

    @UseGuards(MyJwtGuard)
    @Patch('update/:id')
    async updateBook(
        @Request() req,
        @Param() { id }: ParamsWithId,
        @Body() updateData: Partial<Book>
    ) {
        try {
            const books = await this.booksService.getOne({
                _id: id,
                author: req.user._id,
            })
            if (!books) {
                throw new NotFoundException()
            }
            const { title, content } = updateData
            if (title) books.title = title
            if (content) books.content = content
            await books.save()
            return { data: books }
        } catch (error) {
            if (error.status === 404) throw error
            else throw new InternalServerErrorException()
        }
    }

    @UseGuards(MyJwtGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete('delete/:id')
    async deleteBook(@Param() { id }: ParamsWithId) {
        try {
            const user = await this.booksService.deleteById(id)
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
