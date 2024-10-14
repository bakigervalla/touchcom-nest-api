import { WinstonModuleOptions } from 'nest-winston';

export interface Config {
  environment: string;
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  security: SecurityConfig;
  rateLimit: RateLimitConfig;
  hiveMQ: HiveMQConfig;
  winston: WinstonModuleOptions;
  twilio: TwilioConfig;
  sendgrid: SendgridConfig;
  googleCloud: GoogleCloudConfig;
}

export interface NestConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface SecurityConfig {
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
  allowedLoginAttempts: number;
}

export interface RateLimitConfig {
  ttl: number;
  limit: number;
}

export interface HiveMQConfig {
  username: string;
  password: string;
  host: string;
  port: number;
}

export interface TwilioConfig {
  accountSid: string;
  apiKey: string;
  apiKeySecret: string;
  pushCredentialSid: string;
  outgoingApplicationSid: string;
  verifySid: string;
  authToken: string;
  callerPhoneNumber: string;
}

export interface SendgridConfig {
  apiKey: string;
  forgotPasswordTemplateId: string;
  resetPasswordTemplateId: string;
  inviteNewUserTemplateId: string;
  inviteExistingUserTemplateId: string;
  newUserInvitationAcceptedTemplateId: string;
}

export interface GoogleCloudConfig {
  bucketName: string;
}
