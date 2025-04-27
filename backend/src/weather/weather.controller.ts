import { Controller, Get, Query, UseGuards, Request} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WeatherService } from './weather.service';
import { StandardResponse, AuthGuard} from '@app/common';
import { AutocompleteResponse } from './responses/autocomple.response';
import { WeatherResponse } from './responses/weather.response';



@Controller('weather')
@ApiTags('Weather')
@UseGuards(AuthGuard)
export class WeatherController {
  constructor (
    private readonly weatherServices: WeatherService
  ){}
  @Get()
  async getWeather(
    @Request() req: any,
    @Query('city') city: string
  ) : Promise<StandardResponse<WeatherResponse>> 
  {
    return this.weatherServices.getWeather(req.user.id,city)
  }

  @Get('autocomplete') 
  async autocomplete(
    @Query('query') city: string
  ): Promise<StandardResponse<AutocompleteResponse[]>> 
  {
    return this.weatherServices.autocomplete(city)
  }

}
