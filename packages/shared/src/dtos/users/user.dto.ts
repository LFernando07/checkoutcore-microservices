export type RoleType = 'user' | 'admin';

export class UserDto {
  id: string;
  email: string;
  role: RoleType;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserWithPasswordDto extends UserDto {
  password: string;
}