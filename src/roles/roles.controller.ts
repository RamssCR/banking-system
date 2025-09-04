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
import { RolesService } from './roles.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll(): Promise<Role[]> {
    return await this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Role> {
    return await this.rolesService.findOne(id);
  }

  @Post()
  async create(@Body() role: CreateRoleDto): Promise<Role> {
    return await this.rolesService.create(role);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() role: UpdateRoleDto,
  ): Promise<Role> {
    return await this.rolesService.update(id, role);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.rolesService.remove(id);
  }
}
