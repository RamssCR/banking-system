import {
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Account } from '#accounts/entities/account.entity';
import { BaseEntity } from '#common/entities/base.entity';
import { Exclude } from 'class-transformer';
import { Role } from '#roles/entities/role.entity';
import { Transaction } from '#transactions/entities/transaction.entity';
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

  @Exclude()
  @Column({ type: 'varchar', length: 300, nullable: true })
  refreshToken: string | null;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Account, (account) => account.user)
  accounts: Account[];

  @OneToMany(() => Transaction, (transaction) => transaction.performedBy)
  transactions: Transaction[];

  @Exclude()
  private tempPassword?: string;

  @BeforeInsert()
  async hashPasswordInsert() {
    if (this.password) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @BeforeUpdate()
  async hashPasswordUpdate() {
    if (this.password !== this.tempPassword) {
      const salt = await bcrypt.genSalt();
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  @AfterLoad()
  assignTempPassword() {
    this.tempPassword = this.password;
  }
}
