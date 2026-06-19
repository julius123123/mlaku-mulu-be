import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Turis } from '../turis/turis.entity';

@Entity('perjalanan')
export class Perjalanan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  turisId: string;

  @ManyToOne(() => Turis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'turisId' })
  turis: Turis;

  @Column({ type: 'timestamptz' })
  tanggalMulaiPerjalanan: Date;

  @Column({ type: 'timestamptz' })
  tanggalBerakhirPerjalanan: Date;

  @Column({ type: 'jsonb' })
  destinasiPerjalanan: string | Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
