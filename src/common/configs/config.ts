import { LoggingWinston } from '@google-cloud/logging-winston';
import { config as dotenvConfig } from 'dotenv';
import { format, transports } from 'winston';
import { utilities } from 'nest-winston';

import type { Config } from './config.interface';

dotenvConfig();

const config: Config = {
  environment: process.env.ENVIRONMENT,
  nest: {
    port: 3000,
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'Touchcom Device',
    description: 'The Touchcom Device API',
    version: '0.1',
    path: 'api',
  },
  security: {
    expiresIn: '30m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
    allowedLoginAttempts: 5,
  },
  rateLimit: {
    ttl: 60,
    limit: 10,
  },
  hiveMQ: {
    username: process.env.HIVE_MQ_USERNAME,
    password: process.env.HIVE_MQ_PASSWORD,
    host: process.env.HIVE_MQ_HOST,
    port: parseInt(process.env.HIVE_MQ_PORT, 10),
  },
  winston: {
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.ms(),
          utilities.format.nestLike('Touchcom API', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      new LoggingWinston({
        logName: 'touchcom_device',
      }),
    ],
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    apiKey: process.env.TWILIO_API_KEY,
    apiKeySecret: process.env.TWILIO_API_KEY_SECRET,
    pushCredentialSid: process.env.TWILIO_PUSH_CREDENTIAL_SID,
    outgoingApplicationSid: process.env.TWILIO_OUTGOING_APPLICATION_SID,
    verifySid: process.env.TWILIO_VERIFY_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    callerPhoneNumber: process.env.TWILIO_CALLER_PHONE_NUMBER,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    forgotPasswordTemplateId: process.env.SENDGRID_FORGOT_PASSWORD_TEMPLATE_ID,
    resetPasswordTemplateId: process.env.SENDGRID_RESET_PASSWORD_TEMPLATE_ID,
    inviteNewUserTemplateId: process.env.SENDGRID_INVITE_NEW_USER_TEMPLATE_ID,
    inviteExistingUserTemplateId:
      process.env.SENDGRID_INVITE_EXISTING_USER_TEMPLATE_ID,
    newUserInvitationAcceptedTemplateId:
      process.env.SENDGRID_NEW_USER_INVITATION_ACCEPTED_TEMPLATE_ID,
  },
  googleCloud: {
    bucketName: process.env.GCS_BUCKET_NAME,
  },
};

export default (): Config => config;
