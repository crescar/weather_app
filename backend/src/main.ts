import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, BadRequestException  } from '@nestjs/common';
import { StandardResponse } from '@app/common/index';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });
  app.useGlobalPipes(new ValidationPipe({
    exceptionFactory(errors) {
      const response = new StandardResponse(400, 'Validation failed');
      const getErrors = errors.map(error => ({
        field: error.property,
        message: Object.values(error.constraints || {}) as string[],
      }));
      response.error = getErrors;
      return new BadRequestException(response)
    },
  }));
  const config = new DocumentBuilder()
    .setTitle('Weather API')
    .setDescription('The Weather API gets the weather data for a given city')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      }, 'Authorization'
    )
    .addSecurityRequirements('Authorization')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
