import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '#common/entities/base.entity';
import { Role } from '#roles/entities/role.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: 25 })
  username: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 300 })
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;
}
