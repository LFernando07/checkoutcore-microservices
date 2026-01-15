import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import {
  CreateUserDto,
  ErrorCode,
  hashString,
  UserDto,
  DomainRpcException,
} from '@oppn/shared';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // eslint-disable-next-line prettier/prettier
  ) { }

  async create(dto: CreateUserDto) {
    const exists = await this.findByEmail(dto.email);

    // Verificacion de existencia previa de correo electronico
    if (exists) {
      throw new DomainRpcException(ErrorCode.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await hashString(dto.password);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    const userWithoutPassword: UserDto = {
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };

    return userWithoutPassword;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getByEmailOrFail(email: string): Promise<User> {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new DomainRpcException(ErrorCode.USER_NOT_FOUND);
    }

    return user;
  }

  async findById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      // Excepcion serializable en protocolos de transporte como TPC
      throw new DomainRpcException(ErrorCode.USER_NOT_FOUND);
    }

    const userWithoutPassword: UserDto = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return userWithoutPassword;
  }
}
