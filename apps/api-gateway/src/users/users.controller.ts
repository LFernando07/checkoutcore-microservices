import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth/auth.guard';
import {
  CreateUserDto,
  TCPCONSTANTS,
  UserDto,
  sendAndHandle,
} from '@oppn/shared';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(
    @Inject(TCPCONSTANTS.servicesNames.userService)
    private readonly userClient: ClientProxy,
    // eslint-disable-next-line prettier/prettier
  ) { }
  @Get('me')
  async getUserProfile(@CurrentUser() user: UserDto): Promise<UserDto> {
    /* Segunda forma de convertir un observable a promise
    const user$ = this.userClient.send(
      TCPCONSTANTS.routingKeys.userProfileId,
      userId as string,
    );
    return await firstValueFrom(user$);
    */
    return await sendAndHandle<UserDto>(
      this.userClient,
      TCPCONSTANTS.routingKeys.userProfileId,
      user.id,
    );
  }

  @Get(':id')
  async getUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserDto> {
    return await sendAndHandle<UserDto>(
      this.userClient,
      TCPCONSTANTS.routingKeys.userProfileId,
      id,
    );
  }

  @Get()
  async getUserByEmail(@Query('email') email: string): Promise<UserDto> {
    return await sendAndHandle<UserDto>(
      this.userClient,
      TCPCONSTANTS.routingKeys.userProfileEmail,
      email,
    );
  }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return await sendAndHandle<UserDto>(
      this.userClient,
      TCPCONSTANTS.routingKeys.createProfile,
      createUserDto,
    );
  }
}
