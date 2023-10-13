import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    const port = process.env.PORT || process.env.LOCAL_PORT || 4000
    app.useGlobalPipes(new ValidationPipe({ transform: true }))
    await app.listen(port, () => {
        console.log(`🚀 ~ listening on port ${port}`)
    })
}
bootstrap()
