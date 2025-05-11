import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { ConflictException, Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { email, ...data } = createUserDto;

      const userExists = await queryRunner.manager.findOne(User, {
        where: { email },
        select: ['id', 'email']
      });
      
      if(userExists) {
        throw new ConflictException(`El correo ${email} ya está registrado.`);
      }

      const newUser = queryRunner.manager.create(User, { email, ...data });
      const savedUser = await queryRunner.manager.save(newUser);
      
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException) throw error;
      throw new InternalServerErrorException('Error al crear el usuario');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userRepository.find({
        select: ['id', 'email', 'fullName', 'isActive', 'roles'],
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { id } });

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al obtener el usuario');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { email, ...data } = updateUserDto;
      const currentUser = await this.findOne(id);
  
      if (email && email !== currentUser.email) {
        const userWithEmail = await queryRunner.manager.findOne(User, {
          where: { email },
          select: ['id']
        });

        if (userWithEmail) {
          throw new ConflictException(`El correo ${email} ya está en uso por otro usuario.`);
        }
      }
  
      const updatedUser = await queryRunner.manager.preload(User, {
        id,
        email,
        ...data,
      });
  
      if (!updatedUser) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      const savedUser = await queryRunner.manager.save(updatedUser);
      await queryRunner.commitTransaction();
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof ConflictException || error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al actualizar el usuario');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await this.findOne(id);
      await queryRunner.manager.remove(user);
      await queryRunner.commitTransaction();

      return { message: `El usuario ${user.fullName} ha sido eliminado correctamente` };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error al eliminar el usuario');
    } finally {
      await queryRunner.release();
    }
  }
}
