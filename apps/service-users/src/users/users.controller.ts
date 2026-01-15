import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  DomainRpcException,
  ErrorCode,
  TCPCONSTANTS,
  UserDto,
  UserWithPasswordDto,
} from '@oppn/shared';

@Controller()
export class UsersController {
  // eslint-disable-next-line prettier/prettier
  constructor(private readonly usersService: UsersService) { }

  // BUSQUEDA SOLO PARA AUTH
  @MessagePattern(TCPCONSTANTS.routingKeys.userProfileEmail)
  async findByEmail(@Payload() email: string): Promise<UserWithPasswordDto> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new DomainRpcException(ErrorCode.USER_NOT_FOUND);
    }

    return user;
  }

  // SOLO PARA AUTH
  @MessagePattern(TCPCONSTANTS.routingKeys.createProfile)
  async create(@Payload() dto: CreateUserDto): Promise<UserDto> {
    return await this.usersService.create(dto);
  }

  @MessagePattern(TCPCONSTANTS.routingKeys.userProfileId)
  async findById(@Payload() id: string): Promise<UserDto> {
    return await this.usersService.findById(id);
  }
}
