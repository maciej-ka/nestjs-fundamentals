import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Flavor } from './flavor.entity';

@Entity()
export class Coffee {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  brand: string;

  @Column({ default: 0 })
  recommendations: number;

  @Column({ nullable: true })
  description: string;

  @JoinTable()
  @ManyToMany(() => Flavor, (flavor) => flavor.coffees, { cascade: true })
  flavors: Flavor[];
}
