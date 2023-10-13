import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication, Logger, ValidationPipe } from '@nestjs/common'
import { AppModule } from './../src/app.module'
import { RegisterDto } from 'src/auth/dto/register.dto'
import { Book } from '@src/books/book.schema'
import * as pactum from 'pactum'

describe('AppController (e2e)', () => {
    let app: INestApplication

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleFixture.createNestApplication()
        app.useGlobalPipes(new ValidationPipe())
        await app.init()
        app.useLogger(new Logger())

        const PORT = process.env.LOCAL_PORT
        console.log('🚀 ~ file: app.e2e-spec.ts:22 ~ beforeAll ~ PORT:', PORT)

        await app.listen(PORT)
        pactum.request.setBaseUrl(`http://localhost:${PORT}`)
    })

    describe('Auth', () => {
        const dto: RegisterDto = {
            fullName: 'test',
            email: 'existing@example.com',
            password: '12345678',
        }
        describe('Signup', () => {
            it('should throw exception if email empty', () => {
                return pactum
                    .spec()
                    .post('/auth/register')
                    .withBody({
                        password: dto.password,
                    })
                    .expectStatus(400)
            })

            it('should register', () => {
                return pactum
                    .spec()
                    .post('/auth/register')
                    .withBody(dto)
                    .expectStatus(201)
            })
        })
        describe('Login', () => {
            it('should throw exception if missing password', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({
                        email: dto.email,
                    })
                    .expectStatus(400)
            })

            it('should return not found if password or email wrong', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({
                        email: dto.email,
                        password: dto.password + 'wrong',
                    })
                    .expectStatus(404)
            })

            it('should signin', () => {
                return pactum
                    .spec()
                    .post('/auth/login')
                    .withBody({
                        email: dto.email,
                        password: dto.password,
                    })
                    .expectStatus(200)
                    .stores('token', 'token')
            })
        })

        describe('Book', () => {
            const book: Partial<Book> = {
                title: 'Title',
                content: 'description',
            }

            it('should return an array of books', () => {
                return pactum.spec().get('/book').expectStatus(200)
            })

            it('should required Authorization when create', () => {
                return pactum
                    .spec()
                    .post('/book/create')
                    .withBody(book)
                    .expectStatus(401)
            })

            it('should create book', () => {
                return pactum
                    .spec()
                    .post('/book/create')
                    .withHeaders({
                        Authorization: 'Bearer $S{token}',
                    })
                    .withBody(book)
                    .expectStatus(201)
                    .stores('id', 'data._id')
            })

            it('should expect not found when update', () => {
                return pactum
                    .spec()
                    .patch('/book/update/1234')
                    .withHeaders({
                        Authorization: 'Bearer $S{token}',
                    })
                    .withBody(book)
                    .expectStatus(400)
            })

            it('should expect required Authorization when update', () => {
                return pactum
                    .spec()
                    .patch('/book/update/1234')
                    .withBody(book)
                    .expectStatus(401)
            })

            it('should update book', () => {
                return pactum
                    .spec()
                    .patch('/book/update/{id}')
                    .withPathParams('id', '$S{id}')
                    .withHeaders({
                        Authorization: 'Bearer $S{token}',
                    })
                    .withBody(book)
                    .expectStatus(200)
            })

            it('should delete book', () => {
                return pactum
                    .spec()
                    .delete('/book/delete/{id}')
                    .withPathParams('id', '$S{id}')
                    .withHeaders({
                        Authorization: 'Bearer $S{token}',
                    })
                    .expectStatus(204)
            })

            it('should expect not found when delete', () => {
                return pactum
                    .spec()
                    .delete('/book/delete/{id}')
                    .withPathParams('id', '$S{id}')
                    .withHeaders({
                        Authorization: 'Bearer $S{token}',
                    })
                    .expectStatus(404)
            })
        })
    })
    afterAll(async () => {
        await app.close()
    })
})
