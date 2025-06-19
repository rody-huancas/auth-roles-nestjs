import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Action } from '../actions/entities/action.entity';
import { Permission } from './entities/permission.entity';
import { SystemModule } from '../system-modules/entities/system-module.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)   private readonly permissionRepository  : Repository<Permission>,
    @InjectRepository(SystemModule) private readonly systemModuleRepository: Repository<SystemModule>,
    @InjectRepository(Action)       private readonly actionRepository      : Repository<Action>,
    private readonly dataSource: DataSource,
  ) {}
  
  async create(createPermissionDto: CreatePermissionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { systemModuleId, actionId, ...data } = createPermissionDto;

      const systemModule = await this.systemModuleRepository.findOne({
        where: { id: systemModuleId }
      });
      if (!systemModule) {
        throw new NotFoundException(`Módulo del sistema con ID ${systemModuleId} no encontrado`);
      }

      const action = await this.actionRepository.findOne({ where: { id: actionId } });
      if (!action) {
        throw new NotFoundException(`Acción con ID ${actionId} no encontrada`);
      }

      const permissionExists = await queryRunner.manager.findOne(Permission, { where: { systemModuleId, actionId } });

      if (permissionExists) {
        throw new ConflictException(`Ya existe un permiso para el módulo ${systemModule.name} y la acción ${action.name}`);
      }

      const name = data.name || `${systemModule.name} - ${action.name}`;
      const description = data.description || `Permiso para ${action.description} en ${systemModule.name}`;

      const newPermission = queryRunner.manager.create(Permission, {
        name,
        description,
        systemModuleId,
        actionId,
      });

      const savedPermission = await queryRunner.manager.save(newPermission);
      await queryRunner.commitTransaction();

      return await this.permissionRepository.findOne({
        where: { id: savedPermission.id },
        relations: ['systemModule', 'action']
      });

    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al crear el permiso');
    } finally {
      await queryRunner.release();
    }
  }

  findAll() {
    return `This action returns all permissions`;
  }

  findOne(id: string) {
    return `This action returns a #${id} permission`;
  }

  update(id: string, updatePermissionDto: UpdatePermissionDto) {
    return `This action updates a #${id} permission`;
  }

  remove(id: string) {
    return `This action removes a #${id} permission`;
  }
}
