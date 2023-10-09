import { UserType } from '@prisma/client';

export class ResolvedUser {
  id: number;
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
  userType: UserType;
}
