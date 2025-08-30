import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity';
import { User } from '#users/entities/user.entity';

@Entity()
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 25, unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}
