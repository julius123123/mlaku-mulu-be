import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pegawai } from './pegawai.entity';

@Injectable()
export class PegawaiService {
  constructor(
    @InjectRepository(Pegawai)
    private readonly repo: Repository<Pegawai>,
  ) {}

  findByEmail(email: string): Promise<Pegawai | null> {
    return this.repo.findOne({ where: { email } });
  }
}
