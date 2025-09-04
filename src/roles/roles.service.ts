import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { handleDBError } from '#common/helpers/handleDBErrors';

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
      throw handleDBError(error, 'An error occurred while getting the role');
    }
  }

  async create(role: CreateRoleDto): Promise<Role> {
    try {
      const createdRole = this.roleRepository.create(role);
      return await this.roleRepository.save(createdRole);
    } catch (error) {
      throw handleDBError(error, 'An error occurred while creating the role');
    }
  }

  async restore(id: number): Promise<void> {
    try {
      const result = await this.roleRepository.restore(id);
      if (result.affected === 0) {
        throw new NotFoundException(
          'An error occurred while restoring the role',
        );
      }
    } catch (error) {
      throw handleDBError(error, 'An error occurred while restoring the user');
    }
  }

  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    try {
      const role = await this.findOne(id);
      if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

      await this.roleRepository.update(id, dto);
      return this.findOne(id);
    } catch (error) {
      throw handleDBError(error, 'An error occurred while updating the role');
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const result = await this.roleRepository.softDelete(id);
      if (result.affected === 0)
        throw new NotFoundException(`User with ID ${id} not found`);
    } catch (error) {
      throw handleDBError(error, 'An error occurred while deleting the role');
    }
  }
}
