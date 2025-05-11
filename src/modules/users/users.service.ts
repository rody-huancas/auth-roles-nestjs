import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { email, ...data } = createUserDto;

      const userExists = await this.userRepository.findOne({ where: { email } });
      
      if(userExists) {
        throw new ConflictException(`El correo ${email} ya está registrado.`);
      }

      const newUser = this.userRepository.create({ email, ...data });
      
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    const users = await this.userRepository.find();
    return users;
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { email, ...data } = updateUserDto;
  
    const currentUser = await this.findOne(id);
  
    if (email && email !== currentUser.email) {
      const userWithEmail = await this.userRepository.findOne({ where: { email } });

      if (userWithEmail) {
        throw new ConflictException(`El correo ${email} ya está en uso por otro usuario.`);
      }
    }
  
    const updatedUser = await this.userRepository.preload({
      id,
      email,
      ...data,
    });
  
    if (!updatedUser) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return await this.userRepository.save(updatedUser); 
  }

  async remove(id: string) {
    try {
      const user = await this.findOne(id);
      await this.userRepository.remove(user);

      return { message: `El usuario ${user.fullName} ha sido eliminado correctamente` };
    } catch (error) {
      throw error;
    }
  }
}
