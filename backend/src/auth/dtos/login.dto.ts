import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';
export class LoginDto {
  
  @ApiProperty(
    {
      description: 'Email del usuario',
      example: 'tu@email.com'
    }
  )
  @IsEmail({}, { message: 'El email es invalido' })
  @IsNotEmpty({ message: 'El Email es requerido' })
  email: string;

  @ApiProperty(
    {
      description: 'Contraseña del usuario',
      example: 'password123',
    }
  )
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, { message: 'La contraseña debe tener al menos 8 caracteres, una letra y un número' })
  password: string;
}