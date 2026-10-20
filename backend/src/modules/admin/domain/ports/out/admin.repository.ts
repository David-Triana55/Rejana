export interface AdminRepository {
  Create(id: string, email: string, name: string): Promise<void>;
}

export const ADMIN_REPOSITORY = Symbol('AdminRepository');
