import { Action } from 'src/modules/actions/entities/action.entity';
import { SystemModule } from 'src/modules/system-modules/entities/system-module.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'permissions' })
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  name: string;

  @Column('text')
  description: string;

  @Column('uuid')
  systemModuleId: string;

  @ManyToOne(() => SystemModule, { eager: true })
  @JoinColumn({ name: 'systemModuleId' })
  systemModule: SystemModule;

  @Column('uuid')
  actionId: string;

  @ManyToOne(() => Action, { eager: true })
  @JoinColumn({ name: 'actionId' })
  action: Action;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
