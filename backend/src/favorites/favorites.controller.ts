import { Controller, Get, Post, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { FavoritesDto } from './dtos/favorites.dto';
import { AuthGuard } from '@app/common/authorization/authorization.guard';

@Controller('favorites')
@ApiTags('favorites')
@UseGuards(AuthGuard)
export class FavoritesController {

    constructor(private readonly favoritesService: FavoritesService) { }

    @Get()
    async getFavorites(
        @Request() req: any
    ) {
        return this.favoritesService.getFavorites(req.user.id)
    }

    @Post()
    async addFavorite(
        @Request() req: any,
        @Body() favoritesDto: FavoritesDto
    ) {
        return this.favoritesService.addFavorite(req.user.id,favoritesDto)
    }

    @Delete(':id')
    async deleteFavorite(
        @Request() req: any,
        @Param('id') id: number
    ) {
        return this.favoritesService.deleteFavorite(req.user.id,id)
    }

}
