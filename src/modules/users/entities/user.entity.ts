import { compareValue, hashValue } from 'src/utils/bcrypt';
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false })
  password: string;

  @Column('text')
  name: string;

  @Column('text')
  lastname: string;

  @Column('text', { nullable: true })
  fullName: string;

  @Column('boolean', { default: true })
  isActive: boolean;

  @Column('text', { array: true, default: ['user'] })
  roles: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async checkFieldsBeforeInsert() {
    this.email    = this.email.toLowerCase().trim();
    this.fullName = `${this.name} ${this.lastname}`.trim();

    if (this.password) {
      this.password = await hashValue(this.password);
    }
  }
  
  async comparePassword(password: string): Promise<boolean> {
    return await compareValue(password, this.password);
  }
}
