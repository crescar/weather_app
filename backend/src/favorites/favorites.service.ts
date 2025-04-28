import { HttpException, HttpStatus, Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoritesDto } from './dtos/favorites.dto';
import { FavoritesEntity, StandardResponse } from '@app/common';
import { FavoritesResponse } from './responses/favorites.response';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class FavoritesService {
    
    constructor(
        @InjectRepository(FavoritesEntity)
        private readonly favoritesRepository: Repository<FavoritesEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    async getFavorites(userId:number): Promise<StandardResponse<FavoritesResponse[]>>
    {
        const cachedData: any = await this.getDataCaching(`favorites-${userId}`)
        if(cachedData){
            return cachedData
        }
        const response = new StandardResponse<FavoritesResponse[]>(200, 'Favoritos Obtenidos con Exito');
        try {
            response.data = await this.favoritesRepository.find({
                where: {
                    userId
                },
                select: {
                    id:true,
                    city:true,
                    cityId:true,
                    country:true,
                    region:true,
                }
            })
            await this.cacheManager.set(`favorites-${userId}`, response ,10000)
            return response
        } catch (error) {
            response.statusCode = 400
            response.message = "Error obteniendo favoritos"
            response.error = error.message ?? "Error obteniendo favoritos"
            throw new HttpException(response, HttpStatus.BAD_REQUEST);
        }
    }
    
      
    async addFavorite(userId:number,favoritesDto: FavoritesDto) : Promise<StandardResponse<string>> 
    {
        const response = new StandardResponse<string>(200, 'Favorito Agregado con Exito');
        if(await this.favoriteAlredyAsociated(userId,favoritesDto.city, favoritesDto.cityId,)){
            response.statusCode = 400
            response.message = "Erro al agregar favorito"
            response.error = "Favorito ya asociado"
            throw new HttpException(response, HttpStatus.BAD_REQUEST);
        }
        try {
            await this.favoritesRepository.save({
                ...favoritesDto,
                userId
            })
            response.data = "Favorito agregado con exito"
            return response
        } catch (error) {
            console.log(error)
            response.statusCode = 400
            response.message = "Error agregando favorito"
            response.error = error.message ?? "Error agregando favorito"
            throw new HttpException(response, HttpStatus.BAD_REQUEST);
        }
    }
    

    async deleteFavorite(userId:number, id: number): Promise<StandardResponse<string>>
    {
       const response = new StandardResponse<string>(200, 'Favorito Eliminado con Exito');
       try {
        const favorite = await this.favoritesRepository.findOneBy({
            id,
            userId
        })
        if(!favorite){
            response.statusCode = 404
            response.message = "Favorito no encontrado"
            response.error = "Favorito no encontrado"
            throw new HttpException(response, HttpStatus.NOT_FOUND);
        }
        await this.favoritesRepository.delete(id)
        response.data = "Favorito eliminado con exito"
        return response
       } catch (error) {
        response.statusCode = 400
        response.message = "Error eliminando favorito"
        response.error = error.message ?? "Error eliminando favorito"
        throw new HttpException(response, HttpStatus.BAD_REQUEST);
       }
    }

    async favoriteAlredyAsociated(userId:number, city:string, cityId?:number): Promise<boolean>
    {
        if(cityId){
            const existByCityId = await this.favoritesRepository.findOneBy({
                userId,
                cityId
            })
            if(existByCityId){
                return true
            }
        }
        const existByCity = await this.favoritesRepository.findOneBy({
            userId,
            city
        })
        if(existByCity){
            return true
        }
        return false
    }

    async getDataCaching(key:string) {
        return await this.cacheManager.get(key)
    }
}
