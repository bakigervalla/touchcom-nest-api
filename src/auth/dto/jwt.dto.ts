import { PermissionDto } from '@permissions/dto';
import { RoleDto } from '@roles/dto';
import { SiteDto } from '@sites/dto';

export interface JwtDto {
  id: number;
  phone: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  activeSite: SiteDto | null;
  role: RoleDto & {
    permissions: { permission: PermissionDto }[];
  };
  iat: number;
  exp: number;
}
