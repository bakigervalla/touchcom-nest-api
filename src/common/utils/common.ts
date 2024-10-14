import { UserDto } from '@users/dto';

const validatePeriodAccess = (accessStartsAt: Date, accessEndsAt: Date) => {
  const currentDateTime = new Date();
  return (
    !accessStartsAt ||
    !accessEndsAt ||
    (currentDateTime >= accessStartsAt && currentDateTime <= accessEndsAt)
  );
};

const getUserFullName = (user: UserDto | null) => {
  if (!user) {
    return '-';
  }

  return user.companyId || user.apartmentId || user.firstName
    ? `${user.firstName} ${user.lastName}`
    : user.name;
};

export default { validatePeriodAccess, getUserFullName };
