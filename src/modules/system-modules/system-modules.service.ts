import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// Entities
import { SystemModule } from './entities/system-module.entity';
// DTOs
import { CreateSystemModuleDto } from './dto/create-system-module.dto';
import { UpdateSystemModuleDto } from './dto/update-system-module.dto';

@Injectable()
export class SystemModulesService {
  constructor(
    @InjectRepository(SystemModule) private readonly systemModuleRepository: Repository<SystemModule>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createSystemModuleDto: CreateSystemModuleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, ...data } = createSystemModuleDto;

      const systemModuleExists = await queryRunner.manager.findOne(SystemModule, {
        where: { name },
        select: ['id', 'name'],
      });

      if (systemModuleExists) {
        throw new ConflictException(`El módulo del sistema ${name} ya existe`);
      }

      const newSystemModule = queryRunner.manager.create(SystemModule, { name, ...data });
      const savedSystemModule = await queryRunner.manager.save(newSystemModule);

      await queryRunner.commitTransaction();
      return savedSystemModule;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error al crear el módulo del sistema');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return await this.systemModuleRepository.find({ 
        where: { isActive: true },
        order: { order: 'ASC' }
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los módulos del sistema');
    }
  }

  async findOne(id: string) {
    try {
      const systemModule = await this.systemModuleRepository.findOne({ where: { id } });

      if (!systemModule) {
        throw new NotFoundException(`Módulo del sistema con ID ${id} no encontrado`);
      }

      return systemModule;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al obtener el módulo del sistema');
    }
  }

  async update(id: string, updateSystemModuleDto: UpdateSystemModuleDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, ...data } = updateSystemModuleDto;

      const currentSystemModule = await this.findOne(id);

      if (name && name !== currentSystemModule.name) {
        const systemModuleExists = await queryRunner.manager.findOne(SystemModule, {
          where: { name },
          select: ['id', 'name'],
        });

        if (systemModuleExists) {
          throw new ConflictException(`El módulo del sistema ${name} ya existe`);
        }
      }

      const updatedSystemModule = await queryRunner.manager.preload(SystemModule, {
        id,
        name,
        ...data,
      });

      if (!updatedSystemModule) {
        throw new NotFoundException(`Módulo del sistema con ID ${id} no encontrado`);
      }

      const savedSystemModule = await queryRunner.manager.save(updatedSystemModule);

      await queryRunner.commitTransaction();
      return savedSystemModule;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el módulo del sistema');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const systemModule = await this.findOne(id);
      await queryRunner.manager.remove(systemModule);
      await queryRunner.commitTransaction();

      return { message: `El módulo del sistema ${systemModule.name} ha sido eliminado correctamente` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el módulo del sistema');
    } finally {
      await queryRunner.release();
    }
  }
}