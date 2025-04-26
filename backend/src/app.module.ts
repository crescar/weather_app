import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserEntity } from '@app/common/index';
import { WeatherModule } from './weather/weather.module';
import { FavoritesModule } from './favorites/favorites.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PSQL_HOST,
      port: +(process.env.PSQL_PORT ?? 5432),
      password: process.env.PSQL_PASS,
      username: process.env.PSQL_USER,
      database: process.env.PSQL_DB,
      schema: process.env.PSQL_SCHEMA,
      synchronize: false,
      entities: [UserEntity]
    }),
    JwtModule.register({
      global: process.env.JWT_GLOBAL === 'true',
      secret: process.env.JWT_SECRET
    }),
    AuthModule,
    WeatherModule,
    FavoritesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
