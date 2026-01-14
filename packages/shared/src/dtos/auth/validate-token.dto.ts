import { RoleType } from "../users/user.dto";

export interface AuthUser {
  id: string;
  email: string;
  role: RoleType;
}

export interface ValidateTokenResult {
  valid: boolean;
  user: AuthUser | null;
}