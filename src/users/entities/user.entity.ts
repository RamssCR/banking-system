import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { Role } from '#roles/entities/role.entity';
import bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 25 })
  username: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 300 })
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }
}
