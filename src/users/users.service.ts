import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pagination } from '#types/pagination';
import { Repository } from 'typeorm';
import { Role } from '#roles/entities/role.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '#users/entities/user.entity';
import { handleDBError } from '#common/helpers/handleDBErrors';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<Pagination<User[]>> {
    const [data, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['role'],
    });

    return {
      data,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id },
        relations: ['role'],
      });
    } catch (error) {
      throw handleDBError(error, 'An error occurred while getting the user');
    }
  }

  async findOneByEmail(email: string): Promise<User> {
    try {
      return await this.userRepository.findOneOrFail({
        where: { email },
        relations: ['role'],
      });
    } catch (error) {
      throw handleDBError(error, 'An error occurred while getting the user');
    }
  }

  async create(user: CreateUserDto): Promise<User> {
    try {
      const defaultRole = await this.roleRepository.findOneOrFail({
        where: { name: 'user' },
      });

      const createdUser = this.userRepository.create({
        ...user,
        role: defaultRole,
      });
      const savedUser = await this.userRepository.save(createdUser);
      return savedUser;
    } catch (error) {
      throw handleDBError(error, 'An error occurred while creating the user.');
    }
  }

  async restore(id: number): Promise<void> {
    try {
      const result = await this.userRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          'An error occurred while restoring the user.',
        );
      }
    } catch (error) {
      throw handleDBError(error, 'An error occurred while restoring the user.');
    }
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    try {
      const { roleId, ...user } = dto;
      const foundUser = await this.findOne(id);

      if (roleId) {
        const role = await this.roleRepository.findOneByOrFail({
          id: dto.roleId,
        });
        foundUser.role = role;
      }

      Object.assign(foundUser, user);
      return await this.userRepository.save(foundUser);
    } catch (error) {
      throw handleDBError(error, 'An error occurred while updating the user');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.userRepository.softDelete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    } catch (error) {
      throw handleDBError(error, 'An error occurred while deleting the user');
    }
  }

  async setRefreshToken(userId: number, token: string): Promise<void> {
    try {
      await this.userRepository.update(userId, {
        refreshToken: token,
      });
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while setting refresh token',
      );
    }
  }

  async validateRefreshToken(userId: number, token: string): Promise<boolean> {
    try {
      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user || !user.refreshToken) return false;

      return await bcrypt.compare(token, user.refreshToken);
    } catch (error) {
      throw handleDBError(error, 'Invalid refresh');
    }
  }

  async removeRefreshToken(userId: number): Promise<void> {
    try {
      await this.userRepository.update(userId, { refreshToken: null });
    } catch (error) {
      throw handleDBError(
        error,
        'An error occurred while removing the refresh token',
      );
    }
  }
}
