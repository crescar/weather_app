import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './authorization.guard';

describe('AuthGuard', () => {

  const mockContext: any = {
    switchToHttp: jest.fn().mockReturnThis(),
    getRequest: jest.fn().mockReturnValue({
      headers: {
        authorization: 'Bearer mockToken',
      },
    }),
  }

  let authGuard: AuthGuard

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGuard,
        {
            provide: JwtService,
            useValue: {
                verifyAsync: jest.fn().mockResolvedValue({id:1})
            }
        }
    ],
    }).compile();

    authGuard = app.get<AuthGuard>(AuthGuard);
  });

  describe('root', () => {
    it('should work canActivate"', async () => {
      const result = await authGuard.canActivate(mockContext);
      expect(result).toBe(true);
    });

  });
});
