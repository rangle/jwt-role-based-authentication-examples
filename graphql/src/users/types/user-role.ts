import { registerEnumType } from 'type-graphql';

export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  CUSTOMER = 'customer',
  GUEST = 'guest',
}
