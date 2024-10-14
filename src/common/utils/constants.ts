import { Order } from '../types';

export const StrongPasswordOptions = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
  returnScore: false,
  pointsPerUnique: 1,
  pointsPerRepeat: 0.5,
  pointsForContainingLower: 10,
  pointsForContainingUpper: 10,
  pointsForContainingNumber: 10,
  pointsForContainingSymbol: 10,
};

export const PAGE_OPTIONS = {
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 10,
  DEFAULT_ORDER_BY: [{ createdAt: Order.ASC }],
};

export const DEVICE = {
  DUMMY_SERIAL_NUMBER_CHARACTER: '-',
};

export const DAYS = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];
