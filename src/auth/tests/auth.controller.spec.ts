/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';

import { token, user } from '@mocks';

import { PrismaService } from '@~prisma/prisma.service';
import { PublicErrors } from '@common/types';

import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';

describe('Auth Controller', () => {
  let controller: AuthController;
  let service: DeepMockProxy<AuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockDeep<AuthService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    service = module.get(AuthService);
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  it('should login to admin UI successfully', () => {
    service.login.mockResolvedValue(token.testTokens);

    expect(
      controller.loginMobile({
        email: 'company@touchcom.com',
        password: 'company',
      }),
    ).resolves.toStrictEqual(token.testTokens);
  });

  it('should not login to admin UI successfully because user does not exist', () => {
    const expectedResponse = new BadRequestException({
      code: PublicErrors.INVALID_CREDENTIALS,
      message: `Invalid credentials`,
    });

    service.login.mockRejectedValue(expectedResponse);

    expect(
      controller.loginMobile({
        email: 'not-found@touchcom.com',
        password: 'company',
      }),
    ).rejects.toBe(expectedResponse);
  });

  it('should not login to admin UI successfully because user is not active', () => {
    const expectedResponse = new BadRequestException({
      code: PublicErrors.INVALID_CREDENTIALS,
      message: `Account is locked`,
    });

    service.login.mockRejectedValue(expectedResponse);

    expect(
      controller.loginMobile({
        email: 'blocked@touchcom.com',
        password: 'blocked',
      }),
    ).rejects.toBe(expectedResponse);
  });

  it('should change password successfully', () => {
    const { password, verificationCode, ...expectedResponse } =
      user.activeTestUser;

    service.changePassword.mockResolvedValue(expectedResponse);

    expect(
      controller.changePassword(
        { id: 1, email: 'company@touchcom.com' },
        {
          oldPassword: 'company',
          newPassword: 'Company125$',
        },
      ),
    ).resolves.toStrictEqual(expectedResponse);
  });

  it('should refresh access token successfully', () => {
    const refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbXBhbnlAdG91Y2hjb20uY29tIiwiaWF0IjoxNjg0NDA3NTQ4LCJleHAiOjE2ODUwMTIzNDh9.FTYQMAQ0rBmGLE8bWb58tGcm2Dq12g3zo7qTcNRjE5M';

    service.refreshToken.mockResolvedValue(token.testTokens);

    expect(
      controller.refreshToken({ token: refreshToken }),
    ).resolves.toStrictEqual(token.testTokens);
  });

  it('should not refresh access token successfully', () => {
    const refreshToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImNvbXBhbnlAdG91Y2hjb20uY29tIiwiaWF0IjoxNjg0NDA3NTQ4LCJleHAiOjE2ODUwMTIzNDh9.FTYQMAQ0rBmGLE8bWb58tGcm2Dq12g3zo7qTcNRjE5M';

    service.refreshToken.mockRejectedValue(new UnauthorizedException());

    expect(
      controller.refreshToken({ token: refreshToken }),
    ).rejects.toStrictEqual(new UnauthorizedException());
  });
});
