import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    try {
      const role = await this.roleRepository.findOneByOrFail({ id });
      if (!role) throw new BadRequestException(`Role ${id} not found`);

      return role;
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException(
        'An error has ocurred while getting the role',
      );
    }
  }

  async create(role: CreateRoleDto): Promise<Role> {
    try {
      const createdRole = this.roleRepository.create(role);
      return await this.roleRepository.save(createdRole);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException(
        'An error has ocurred while creating the role',
      );
    }
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(id);
      if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

      await this.roleRepository.update(id, dto);
      return this.findOne(id);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException(
        'An error has ocurred while updating the role',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.roleRepository.softDelete(id);
      if (result.affected === 0)
        throw new NotFoundException(`User with ID ${id} not found`);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new InternalServerErrorException(error.message);
      }

      throw new InternalServerErrorException(
        'An error has ocurred while deleting the role',
      );
    }
  }
}
