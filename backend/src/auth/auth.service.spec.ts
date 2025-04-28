import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StandardResponse, UserEntity, hashingPassword } from '@app/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './responses/login.response';
import { RegisterResponse } from './responses/register.response';


describe('AuthService', () => {
  let authService: AuthService

  const monckLoginDto = {
    email: "tu@email.com",
    password: "pass123456"
  }

  const mockUser = {
    email: "tu@email.com",
    password: "pass123456",
    name: "test",
    createdAt: new Date()
  }

  const responseLogin = new StandardResponse<LoginResponse>(200, 'Inicio de sesion exitoso')

  responseLogin.data = {
    email: mockUser.email,
    name: mockUser.name,
    token: "token"
  }

  const mockRegisterDto = {
    email: "tu@email.com",
    password: "123456",
    confirmPassword: "123456",
    name: "test"
  }

  const responseRegister = new StandardResponse<RegisterResponse>(200, 'Registro exitoso')
  responseRegister.data = {
    email: mockUser.email,
    name: mockUser.name,
    token: "token"
  }


  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
            provide: getRepositoryToken(UserEntity),
            useValue: {
                findOneByOrFail: jest.fn().mockResolvedValue(mockUser),
                save: jest.fn().mockResolvedValue({id: 1, ...mockUser})
            }
        },
        {
            provide: JwtService,
            useValue: {
                signAsync: jest.fn().mockResolvedValue("token")
            }
        }
    ],
    }).compile();

    authService = app.get<AuthService>(AuthService);
  });

  describe('root', () => {
    it('should work login"', async () => {
      mockUser.password = await hashingPassword(mockUser.password)
      const login = await authService.login(monckLoginDto)
      expect(login).toEqual(responseLogin)
    });

    it('should work register"', async () => {
      const register = await authService.register(mockRegisterDto)
      expect(register).toEqual(responseRegister)
    });

  });
});
