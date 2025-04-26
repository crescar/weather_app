import { Controller, Get, Query} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { StandardResponse } from '@app/common/index';
import { AutocompleteResponse } from './responses/autocomple.response';
import { WeatherResponse } from './responses/weather.response';

@Controller('weather')
@ApiTags('Weather')
export class WeatherController {
  constructor (
    private readonly weatherServices: WeatherService
  ){}
  @Get()
  async getWeather(@Query('city') city: string) : Promise<StandardResponse<WeatherResponse>> 
  {
    return this.weatherServices.getWeather(city)
  }

  @Get('autocomplete') 
  async autocomplete(
    @Query('query') city: string
  ): Promise<StandardResponse<AutocompleteResponse[]>> 
  {
    return this.weatherServices.autocomplete(city)
  }

}
