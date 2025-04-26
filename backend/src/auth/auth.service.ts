import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';
import { LoginResponse } from './responses/login.response';
import { RegisterResponse } from './responses/register.response';
import { RegisterDto } from './dtos/register.dto';
import { UserEntity, StandardResponse, hashingPassword, comparePass } from '@app/common/index';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ){}
  
  async login(loginDto: LoginDto): Promise<StandardResponse<LoginResponse>>  {
    const loginResponse = new StandardResponse<LoginResponse>(200, 'Inicio de sesion exitoso');
    const user = await this.getUserByEmail(loginDto.email)
    if(!await comparePass(loginDto.password, user.password)){
      loginResponse.statusCode = 400
      loginResponse.message = "Error al iniciar Sesion"
      loginResponse.error = "Contraseña Invalida"
      throw new HttpException(loginResponse, HttpStatus.BAD_REQUEST); 
    }
    const dataLogin: LoginResponse = {
      email: user.email,
      name: user.name,
      token: await this.jwtService.signAsync({id: user.id})
    }
    loginResponse.data = dataLogin
    return loginResponse;
  
  }

  async register(registerDto: RegisterDto): Promise<StandardResponse<RegisterResponse>>  {
    const registerResponse = new StandardResponse<RegisterResponse>(200, 'Registro exitoso');
    if(registerDto.password !== registerDto.confirmPassword) {
      registerResponse.statusCode = 400
      registerResponse.message = "Error en registro"
      registerResponse.error =  "Error las contraseñas deben ser iguales "
      throw new HttpException(registerResponse, HttpStatus.BAD_REQUEST);
    }
    try {
      const newUser = new UserEntity()
      newUser.email = registerDto.email
      newUser.name = registerDto.name
      newUser.password = await hashingPassword(registerDto.password)
      newUser.createdAt = new Date()
      const saveUser = await this.usersRepository.save(newUser)
      const dataRegister: RegisterResponse = {
        email: newUser.email,
        name: newUser.name,
        token: await this.jwtService.signAsync({id: saveUser.id})
      }
      registerResponse.data = dataRegister
      return registerResponse
    } catch (error) {
      console.log(error)
      registerResponse.statusCode = 400
      registerResponse.message = "Error en registro"
      registerResponse.error = error.message ?? "Error registrando al usuario"
      throw new HttpException(registerResponse, HttpStatus.BAD_REQUEST);
    }

  }

  private async getUserByEmail(email:string) {
    try {
      const user = await this.usersRepository.findOneByOrFail({
        email
      })
      return user;
    } catch (error) {
      const faileResponse = new StandardResponse<any>(400, 'Error al buscar al usuario');
      faileResponse.error = error.message ?? "Error al buscar el usuario"
      throw new HttpException(faileResponse, HttpStatus.BAD_REQUEST);    
    }
  }

}
