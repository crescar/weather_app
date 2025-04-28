import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { StandardResponse } from '@app/common';
import { AutocompleteResponse } from './responses/autocomple.response';
import { WeatherResponse } from './responses/weather.response';
import { FavoritesService } from '../favorites/favorites.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';


@Injectable()
export class WeatherService {

  constructor(
    private readonly httpService: HttpService,
    private readonly favoritesService: FavoritesService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  async getWeather(userId:number, city: string):Promise<StandardResponse<WeatherResponse>> {
    const response = new StandardResponse<WeatherResponse>(200, "Información obtenida correctamente")
    const hasCityId = city.split("id:")[1]
    const isFavorite = await this.favoritesService.favoriteAlredyAsociated(userId,city ,hasCityId ? +hasCityId : undefined)
    const cachedData: any = await this.getDataCaching(`${userId}-${city}`)
    if (cachedData) {
      response.data = {
        ...cachedData,
        isFavorite: isFavorite
      }
      return response
    }
    try {
      const {data} = await firstValueFrom(this.httpService.get(`current.json?q=${city}`))
      const weather:WeatherResponse = {
        name: data.location.name,
        region: data.location.region,
        country: data.location.country,
        tempC: data.current.temp_c,
        tempF: data.current.temp_f,
        feelslikeC: data.current.feelslike_c,
        feelslikeF: data.current.feelslike_f,
        hour: data.location.localtime.split(" ")[1],
        date: data.location.localtime.split(" ")[0],
        condition: data.current.condition.text,
        humidity: data.current.humidity,
        cloud: data.current.cloud,
        windKph: data.current.wind_kph,
        isFavorite: isFavorite,
        icon: data.current.condition.icon
      }
      response.data = weather
      await this.cacheManager.set(`${userId}-${city}`, weather,60000)
      return response
    } catch (error) {
      response.statusCode = 400
      response.message = "Error al buscar el clima"
      response.error = error.message ?? "Error al buscar el clima"
      throw new HttpException(response, HttpStatus.BAD_REQUEST)  
    }
  }

  async autocomplete(city: string):Promise<StandardResponse<AutocompleteResponse[]>> {
    const response = new StandardResponse<AutocompleteResponse[]>(200, "Información obtenida correctamente")
    const cachedData: any = await this.getDataCaching(`autocomplete-${city}`)
    if(cachedData){
      return cachedData
    }
    try {
      const weather = await firstValueFrom(this.httpService.get(`search.json?q=${city}`))
      const data:AutocompleteResponse[] = weather.data.map((item: any) => {
        return {
          id: item.id,
          name: item.name,
          region: item.region,
          country: item.country
        }
      })
      response.data = data
      await this.cacheManager.set(`autocomplete-${city}`, response ,60000)
      return response
    } catch (error) {
      response.statusCode = 400
      response.message = "Error al buscar el autocompletar"
      response.error = error.message ?? "Error al buscar el autocompletar"
      throw new HttpException(response, HttpStatus.BAD_REQUEST)
    }
  }

  async getDataCaching(key:string) {
    return await this.cacheManager.get(key)
  }
}
