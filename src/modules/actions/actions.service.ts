import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
// Entities
import { Action } from './entities/action.entity';
// DTOs
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@Injectable()
export class ActionsService {
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createActionDto: CreateActionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, ...data } = createActionDto;

      const actionExists = await queryRunner.manager.findOne(Action, {
        where: { name },
        select: ['id', 'name'],
      });

      if (actionExists) {
        throw new ConflictException(`La acción ${name} ya existe`);
      }

      const newAction = queryRunner.manager.create(Action, { name, ...data });
      const savedAction = await queryRunner.manager.save(newAction);

      await queryRunner.commitTransaction();
      return savedAction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error al crear la acción');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    try {
      return await this.actionRepository.find({
        order: { name: 'ASC' },
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener las acciones');
    }
  }

  async findOne(id: string) {
    try {
      const action = await this.actionRepository.findOne({ where: { id } });

      if (!action) {
        throw new NotFoundException(`Acción con ID ${id} no encontrada`);
      }

      return action;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al obtener la acción');
    }
  }

  async update(id: string, updateActionDto: UpdateActionDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { name, ...data } = updateActionDto;

      const currentAction = await this.findOne(id);

      if (name && name !== currentAction.name) {
        const actionExists = await queryRunner.manager.findOne(Action, {
          where: { name },
          select: ['id', 'name'],
        });

        if (actionExists) {
          throw new ConflictException(`La acción ${name} ya existe`);
        }
      }

      const updatedAction = await queryRunner.manager.preload(Action, {
        id,
        name,
        ...data,
      });

      if (!updatedAction) {
        throw new NotFoundException(`Acción con ID ${id} no encontrada`);
      }

      const savedAction = await queryRunner.manager.save(updatedAction);

      await queryRunner.commitTransaction();
      return savedAction;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      )
        throw error;
      throw new InternalServerErrorException('Error al actualizar la acción');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const action = await this.findOne(id);
      await queryRunner.manager.remove(action);
      await queryRunner.commitTransaction();

      return {
        message: `La acción ${action.name} ha sido eliminada correctamente`,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar la acción');
    } finally {
      await queryRunner.release();
    }
  }
}
