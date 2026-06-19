import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateTurisDto } from './dto/create-turis.dto';
import { UpdateTurisDto } from './dto/update-turis.dto';
import { Turis } from './turis.entity';

const SAFE_SELECT = {
  id: true,
  nama: true,
  email: true,
  telepon: true,
  alamat: true,
  createdAt: true,
  updatedAt: true,
} as const;

@Injectable()
export class TurisService {
  constructor(
    @InjectRepository(Turis)
    private readonly repo: Repository<Turis>,
  ) {}

  findByEmail(email: string): Promise<Turis | null> {
    return this.repo.findOne({ where: { email } });
  }

  findAll(): Promise<Turis[]> {
    return this.repo.find({ select: SAFE_SELECT });
  }

  async findOne(id: string): Promise<Turis> {
    const turis = await this.repo.findOne({ where: { id }, select: SAFE_SELECT });
    if (!turis) throw new NotFoundException('Turis tidak ditemukan');
    return turis;
  }

  async create(dto: CreateTurisDto): Promise<Omit<Turis, 'password'>> {
    const exists = await this.findByEmail(dto.email);
    if (exists) throw new ConflictException('Email sudah terdaftar');
    const hashed = await bcrypt.hash(dto.password, 10);
    const saved = await this.repo.save(this.repo.create({ ...dto, password: hashed }));
    const { password: _, ...result } = saved;
    return result;
  }

  async update(id: string, dto: UpdateTurisDto): Promise<Omit<Turis, 'password'>> {
    const turis = await this.repo.findOne({ where: { id } });
    if (!turis) throw new NotFoundException('Turis tidak ditemukan');
    Object.assign(turis, dto);
    const saved = await this.repo.save(turis);
    const { password: _, ...result } = saved;
    return result;
  }

  async remove(id: string): Promise<{ message: string }> {
    const turis = await this.repo.findOne({ where: { id } });
    if (!turis) throw new NotFoundException('Turis tidak ditemukan');
    await this.repo.remove(turis);
    return { message: 'Turis berhasil dihapus' };
  }
}
