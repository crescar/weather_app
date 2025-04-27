import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsNumber, IsOptional  } from 'class-validator';

export class FavoritesDto {

    @ApiProperty({
        description: "Numero de indenficacion de la ciudad",
        example: 1
    })
    @IsOptional()
    cityId?: number;

    @ApiProperty({
        description: "Nombre de la ciudad",
        example: "Barquisimeto"
    })
    @IsNotEmpty({message: "El nombre de la ciudad no puede estar vacio"})
    city:string

    @ApiProperty({
        description: "Nombre del pais",
        example: "Venezuela"
    })
    @IsNotEmpty({message: "El nombre del pais no puede estar vacio"})
    country:string

    @ApiProperty({
        description: "Nombre de la region",
        example: "Lara"
    })
    @IsNotEmpty({message: "El nombre de la region no puede estar vacio"})
    region:string 
}