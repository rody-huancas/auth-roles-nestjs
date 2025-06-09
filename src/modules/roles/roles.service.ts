import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// Entities
import { Role } from './entities/role.entity';
// DTOs
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, ...data } = createRoleDto;

      const roleExists = await queryRunner.manager.findOne(Role, {
        where: { name: name.toUpperCase() },
        select: ['id', 'name'],
      });

      if (roleExists) {
        throw new ConflictException(`El rol ${name} ya existe`);
      }

      const newRole = queryRunner.manager.create(Role, { name, ...data });
      const savedRole = await queryRunner.manager.save(newRole);

      await queryRunner.commitTransaction();
      return savedRole;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error al crear el rol');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return await this.roleRepository.find({ where: { isActive: true } });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los roles');
    }
  }

  async findOne(id: string) {
    try {
      const role = await this.roleRepository.findOne({ where: { id } });

      if (!role) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      return role;
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener el rol');
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, ...data } = updateRoleDto;

      const currentRole = await this.findOne(id);

      if (name && name.toUpperCase() !== currentRole.name) {
        const roleExists = await queryRunner.manager.findOne(Role, {
          where: { name: name.toUpperCase() },
          select: ['id', 'name'],
        });

        if (roleExists) {
          throw new ConflictException(`El rol ${name} ya existe`);
        }
      }

      const updatedRole = await queryRunner.manager.preload(Role, {
        id,
        name: name?.toUpperCase(),
        ...data,
      });

      if (!updatedRole) {
        throw new NotFoundException(`Rol con ID ${id} no encontrado`);
      }

      const savedRole = await queryRunner.manager.save(updatedRole);

      await queryRunner.commitTransaction();
      return savedRole;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error al actualizar el rol');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role = await this.findOne(id);
      await queryRunner.manager.remove(role);
      await queryRunner.commitTransaction();

      return { message: `El rol ${role.name} ha sido eliminado correctamente` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el rol');
    } finally {
      await queryRunner.release();
    }
  }
}
