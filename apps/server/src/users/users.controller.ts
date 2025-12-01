import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';

import { UsersService } from './users.service';

import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get()
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @Get('email/:email')
  async getUserByEmail(@Param('email') email: string) {
    return await this.usersService.getUserByEmail(email);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    return await this.usersService.deleteUser(id);
  }

  @Get(':id/roles')
  async getUserRoles(@Param('id') id: string) {
    return await this.usersService.getUserRoles(id);
  }

  @Post(':id/roles')
  async assignUserRole(@Param('id') id: string, @Body() assignRoleDto: AssignRoleDto) {
    return await this.usersService.assignUserRole(id, assignRoleDto.role);
  }

  @Delete(':id/roles/:role')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeUserRole(@Param('id') id: string, @Param('role') role: 'provider' | 'seeker' | 'admin') {
    return await this.usersService.removeUserRole(id, role);
  }
}
