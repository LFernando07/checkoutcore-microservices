import { UserDto } from "../users/user.dto";

export class LoginUserResponseDto {
  access_token: string;
  user: UserDto
}
