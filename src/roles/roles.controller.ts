import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Role | null> {
    return await this.rolesService.findOne(id);
  }

  @Post()
  async create(@Body() role: Role): Promise<Role> {
    return await this.rolesService.create(role);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() role: Partial<Role>,
  ): Promise<Role | null> {
    return await this.rolesService.update(id, role);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.rolesService.remove(id);
  }
}
