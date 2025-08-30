import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role | null> {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new BadRequestException(`Role ${id} not found`);
    return role;
  }

  async create(role: Role): Promise<Role> {
    const createdRole = this.roleRepository.create(role);
    return await this.roleRepository.save(createdRole);
  }

  async update(id: number, role: Partial<Role>) {
    await this.roleRepository.update(id, role);
    return this.roleRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.roleRepository.findOneBy({ id });
    await this.roleRepository.delete(id);
  }
}
