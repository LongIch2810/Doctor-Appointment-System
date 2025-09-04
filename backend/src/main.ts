import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookiesParser from 'cookie-parser';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RemoveFieldPasswordInterceptor } from './common/interceptors/removeFieldPassword.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors({
    credentials: true,
  });
  app.use(cookiesParser());
  app.setGlobalPrefix('api/v1');
  app.useGlobalInterceptors(
    new RemoveFieldPasswordInterceptor(),
    new ResponseInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('System Booking Doctor')
    .setDescription('API cho hệ thống đặt lịch khám bác sĩ')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, documentFactory);
  await app.listen(configService.get<number>('PORT') ?? 3000);
}
bootstrap();
