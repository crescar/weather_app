import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StandardResponse,  FavoritesEntity } from '@app/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { FavoritesService } from './favorites.service';
import { FavoritesResponse } from './responses/favorites.response';


describe('FavoritesService', () => {
  let favoritesService: FavoritesService

  const mockGetFavorites = new StandardResponse<FavoritesResponse[]>(200, 'Favoritos Obtenidos con Exito');
  mockGetFavorites.data = [
    {
        id: 1,
        city: 'Barquisimeto',
        cityId: 1,
        country: 'Venezuela',
        region: 'Lara'
    }
  ]
  const mockAddFavorite = new StandardResponse<string>(200, 'Favorito Agregado con Exito');
  mockAddFavorite.data = "Favorito agregado con exito"
  const mockDeleteFavorite = new StandardResponse<string>(200, 'Favorito Eliminado con Exito');
  mockDeleteFavorite.data = "Favorito eliminado con exito"

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
            provide: getRepositoryToken(FavoritesEntity),
            useValue: {
                find: jest.fn().mockResolvedValue(mockGetFavorites.data),
                save: jest.fn().mockResolvedValue({}),
                findOneBy: jest.fn().mockResolvedValue({id:1}),
                delete: jest.fn().mockResolvedValue({})
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

    favoritesService = app.get<FavoritesService>(FavoritesService);
    favoritesService.favoriteAlredyAsociated = jest.fn().mockResolvedValue(false)
  });

  describe('root', () => {
    it('should work getFavorites"', async () => {
      const favorites = await favoritesService.getFavorites(1)
      expect(favorites).toEqual(mockGetFavorites)
    });

    it('should work addFavorite"', async () => {
      const favorite = await favoritesService.addFavorite(1,{
        city: 'Barquisimeto',
        cityId: 1,
        country: 'Venezuela',
        region: 'Lara'
      })
      expect(favorite).toEqual(mockAddFavorite)
    });

    it('should work deleteFavorite"', async () => {
      const favorite = await favoritesService.deleteFavorite(1,1)
      expect(favorite).toEqual(mockDeleteFavorite)
    });

  });
});
