import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { StandardResponse } from '@app/common';
import { LoginResponse } from './responses/login.response';
import { RegisterResponse } from './responses/register.response';

@Controller('auth')
@ApiTags('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto
  ): Promise<StandardResponse<LoginResponse>> 
  {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto
  ): Promise<StandardResponse<RegisterResponse>>  {
    return this.authService.register(registerDto);
  }

}
