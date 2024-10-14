import { UserEntity } from '@users/entities';

const activeTestUser: Partial<UserEntity> = {
  id: 1,
  email: 'company@touchcom.com',
  password: 'company',
  fcmToken: null,
  verificationCode: null,
  verificationCodeExpiration: null,
  otpRequestCooldownExpiration: null,
  firstName: 'company name',
  lastName: 'company last name',
  phone: '+23423423',
  imageUrl:
    'https://gravatar.com/avatar/4849ac5d9be27f2af62daff7fafe6987?s=200&d=mp&r=x',
  status: 'ACTIVE',
  roleId: null,
  companyId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const blockedTestUser: Partial<UserEntity> = {
  id: 2,
  email: 'blocked@touchcom.com',
  password: 'blocked',
  fcmToken: null,
  verificationCode: null,
  verificationCodeExpiration: null,
  otpRequestCooldownExpiration: null,
  firstName: 'blocked name',
  lastName: 'blocked last name',
  phone: '+234623423',
  imageUrl:
    'https://gravatar.com/avatar/b31199296ce82904d5e9fb934838d9b9?s=400&d=robohash&r=x',
  status: 'BLOCKED',
  roleId: null,
  companyId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default { activeTestUser, blockedTestUser };
