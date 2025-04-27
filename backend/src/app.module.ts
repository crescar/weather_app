import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { Keyv } from 'keyv';
import { CacheableMemory } from 'cacheable';
import { UserEntity , FavoritesEntity } from '@app/common';
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
      entities: [UserEntity, FavoritesEntity]
    }),
    JwtModule.register({
      global: process.env.JWT_GLOBAL === 'true',
      secret: process.env.JWT_SECRET
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () =>{
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            createKeyv(`redis://${process.env.REDIS_USER}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`),
          ]
        }
      }
    }),
    AuthModule,
    WeatherModule,
    FavoritesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
