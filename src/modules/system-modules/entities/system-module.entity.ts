import { Permission } from 'src/modules/permissions/entities/permission.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity({ name: 'system_modules' })
export class SystemModule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text')
  description: string;

  @Column('text')
  icon: string;

  @Column('int')
  order: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @OneToMany(() => Permission, permission => permission.systemModule)
  permissions: Permission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
