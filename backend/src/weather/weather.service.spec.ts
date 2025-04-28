import { Test, TestingModule } from '@nestjs/testing';
import { StandardResponse } from '@app/common';
import { WeatherService } from './weather.service';
import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FavoritesService } from '../favorites/favorites.service'
import { AutocompleteResponse } from './responses/autocomple.response';
import { WeatherResponse } from './responses/weather.response';
import { of } from 'rxjs';


describe('WeatherService', () => {
  let weatherService: WeatherService
  const city = "Barquisimeto"
  const mockWeather = new StandardResponse<WeatherResponse>(200,"Información obtenida correctamente")
  mockWeather.data = {
    name: 'Barquisimeto',
    region: 'Lara',
    country: 'Venezuela',
    tempC: 25,
    tempF: 77,
    feelslikeC: 25,
    feelslikeF: 77,
    hour: "12:00",
    date: "2025-04-27",
    condition: 'Sunny',
    humidity: 10,
    cloud: 10,
    windKph: 10,
    isFavorite: false,
    icon: 'https://example.com/icon.png'
  }
  const mockAutocomplete = new StandardResponse<AutocompleteResponse[]>(200,"Información obtenida correctamente")
  mockAutocomplete.data = [
    {
        id: 1,
        name: 'Barquisimeto',
        region: 'Lara',
        country: 'Venezuela'
    }
  ]

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        WeatherService,
        {
            provide: HttpService,
            useValue: {
                get: jest.fn().mockImplementation((url:string)=>{
                    switch (url) {
                        case 'current.json?q=Barquisimeto':
                            return of({
                                data : {
                                    location: {
                                        name: 'Barquisimeto',
                                        region: 'Lara',
                                        country: 'Venezuela',
                                        localtime: "2025-04-27 12:00"
                                    },
                                    current: {
                                        temp_c: 25,
                                        temp_f: 77,
                                        feelslike_c: 25,
                                        feelslike_f: 77,
                                        condition: {
                                            text: 'Sunny',
                                            icon: 'https://example.com/icon.png'
                                        },
                                        humidity: 10,
                                        cloud: 10,
                                        wind_kph: 10
                                    }
                                }
                            })
                        case 'search.json?q=Barquisimeto':
                            return of({
                              data: [
                                    {
                                        id: 1,
                                        name: 'Barquisimeto',
                                        region: 'Lara',
                                        country: 'Venezuela'
                                    }
                                ]
                            })
                        default:
                            return of({})
                    }   
                })
            }
        },
        {
            provide: FavoritesService,
            useValue: {
                favoriteAlredyAsociated: jest.fn().mockResolvedValue(false)
            }
        },
        {
            provide: CACHE_MANAGER,
            useValue: {
                get: jest.fn().mockResolvedValue(null),
                set: jest.fn()
            }
        }
    ],
    }).compile();
    weatherService = app.get<WeatherService>(WeatherService);
  });

  describe('root', () => {
    it('should work getWeather"', async () => {
      const weather = await weatherService.getWeather(1,city)
      expect(weather).toEqual(mockWeather)
    });

    it('should work autocomplete"', async () => {
        const autocomplete = await weatherService.autocomplete(city)
        expect(autocomplete).toEqual(mockAutocomplete)   
    });

  });
});
