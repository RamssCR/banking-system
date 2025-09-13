import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { Roles } from '#common/decorators/roles.decorator';
import { RolesService } from './roles.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Roles('admin', 'moderator')
  @Get()
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Roles('admin', 'moderator')
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.findOne(id);
  }

  @Roles('admin')
  @Post()
  async create(@Body() role: CreateRoleDto): Promise<Role> {
    return await this.rolesService.create(role);
  }

  @Roles('admin')
  @Patch(':id/restore')
  async restore(@Param('id') id: number): Promise<void> {
    return await this.rolesService.restore(id);
  }

  @Roles('admin')
  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() role: UpdateRoleDto,
  ): Promise<Role> {
    return await this.rolesService.update(id, role);
  }

  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.rolesService.remove(id);
  }
}
