import { Module } from '@nestjs/common';
import { WeatherController } from './weather.controller';
import { WeatherService } from './weather.service';
import { HttpModule } from '@nestjs/axios';
import { FavoritesModule } from 'src/favorites/favorites.module';

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
        baseURL: process.env.WEATHER_API_URL,
        params: {
          key: process.env.WEATHER_API_KEY,
          lang:'es'
        }
      }),
    }),
    FavoritesModule
  ],
  controllers: [WeatherController],
  providers: [WeatherService]
})
export class WeatherModule {}
