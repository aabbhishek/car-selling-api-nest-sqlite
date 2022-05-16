import { Exclude } from 'class-transformer';
import { Report } from 'src/reports/reports.entities';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted User with id ', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id ', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Remove user with id ', this.id);
  }
}
