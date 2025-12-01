import { and, eq } from 'drizzle-orm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { provider, seeker, user, userRole } from '@repo/database';

import { DatabaseService } from '../database/database.service';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DatabaseService) {}

  async createUser(createUserDto: CreateUserDto) {
    const [newUser] = await this.dbService.db.insert(user).values(createUserDto).returning();

    return newUser;
  }

  async getAllUsers() {
    return await this.dbService.db.select().from(user);
  }

  async getUserById(id: string) {
    const [foundUser] = await this.dbService.db.select().from(user).where(eq(user.id, id));

    if (!foundUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return foundUser;
  }

  async getUserByEmail(email: string) {
    const [foundUser] = await this.dbService.db.select().from(user).where(eq(user.email, email));

    return foundUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const [updatedUser] = await this.dbService.db
      .update(user)
      .set({ ...updateUserDto, updatedAt: new Date() })
      .where(eq(user.id, id))
      .returning();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async deleteUser(id: string) {
    const [deletedUser] = await this.dbService.db.delete(user).where(eq(user.id, id)).returning();

    if (!deletedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return { message: 'User deleted successfully' };
  }

  async getUserRoles(userId: string) {
    return await this.dbService.db.select().from(userRole).where(eq(userRole.userId, userId));
  }

  async assignUserRole(userId: string, role: 'provider' | 'seeker' | 'admin') {
    // Check if user exists
    await this.getUserById(userId);

    // Check if role already assigned
    const existingRole = await this.dbService.db
      .select()
      .from(userRole)
      .where(and(eq(userRole.userId, userId), eq(userRole.role, role)));

    if (existingRole.length > 0) {
      throw new ConflictException(`User already has role: ${role}`);
    }

    // Assign role
    await this.dbService.db.insert(userRole).values({
      userId,
      role,
    });

    // Create role-specific records
    if (role === 'provider') {
      await this.dbService.db.insert(provider).values({ userId });
    }

    if (role === 'seeker') {
      await this.dbService.db.insert(seeker).values({ userId });
    }

    return { message: `Role ${role} assigned successfully` };
  }

  async removeUserRole(userId: string, role: 'provider' | 'seeker' | 'admin') {
    await this.dbService.db.delete(userRole).where(and(eq(userRole.userId, userId), eq(userRole.role, role)));
  }
}
