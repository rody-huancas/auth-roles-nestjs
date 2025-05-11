import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  email: string;

  @Column('varchar', { select: false })
  password: string;

  @Column('varchar')
  name: string;

  @Column('varchar')
  lastname: string;

  @Column('varchar', { nullable: true })
  fullName: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('varchar', { array: true, default: ['user'] })
  roles: string[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email    = this.email.toLowerCase().trim();
    this.fullName = `${this.name} ${this.lastname}`.trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
