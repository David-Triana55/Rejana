export const Role = {
  Admin: 'admin',
  Chef: 'chef',
  Cashier: 'cashier',
  Waiter: 'waiter',
  Domiciliary: 'domiciliary',
  Customer: 'customer',
} as const;

export type RoleName = (typeof Role)[keyof typeof Role];

export const ROLES = Object.values(Role);
