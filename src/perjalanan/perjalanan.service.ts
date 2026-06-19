import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePerjalananDto } from './dto/create-perjalanan.dto';
import { UpdatePerjalananDto } from './dto/update-perjalanan.dto';
import { Perjalanan } from './perjalanan.entity';

const PERJALANAN_SELECT = {
  id: true,
  turisId: true,
  tanggalMulaiPerjalanan: true,
  tanggalBerakhirPerjalanan: true,
  destinasiPerjalanan: true,
  createdAt: true,
  updatedAt: true,
  turis: {
    id: true,
    nama: true,
    email: true,
    telepon: true,
    alamat: true,
  },
} as const;

@Injectable()
export class PerjalananService {
  constructor(
    @InjectRepository(Perjalanan)
    private readonly repo: Repository<Perjalanan>,
  ) {}

  findAll(): Promise<Perjalanan[]> {
    return this.repo.find({
      relations: { turis: true },
      select: PERJALANAN_SELECT,
    });
  }

  findByTurisId(turisId: string): Promise<Perjalanan[]> {
    return this.repo.find({
      where: { turisId },
      select: {
        id: true,
        turisId: true,
        tanggalMulaiPerjalanan: true,
        tanggalBerakhirPerjalanan: true,
        destinasiPerjalanan: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string): Promise<Perjalanan> {
    const p = await this.repo.findOne({
      where: { id },
      relations: { turis: true },
      select: PERJALANAN_SELECT,
    });
    if (!p) throw new NotFoundException('Perjalanan tidak ditemukan');
    return p;
  }

  create(dto: CreatePerjalananDto): Promise<Perjalanan> {
    const perjalanan = this.repo.create(dto);
    return this.repo.save(perjalanan);
  }

  async update(id: string, dto: UpdatePerjalananDto): Promise<Perjalanan> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Perjalanan tidak ditemukan');
    Object.assign(p, dto);
    return this.repo.save(p);
  }

  async remove(id: string): Promise<{ message: string }> {
    const p = await this.repo.findOne({ where: { id } });
    if (!p) throw new NotFoundException('Perjalanan tidak ditemukan');
    await this.repo.remove(p);
    return { message: 'Perjalanan berhasil dihapus' };
  }
}
