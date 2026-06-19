import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pegawai } from './pegawai.entity';
import { PegawaiService } from './pegawai.service';

@Module({
  imports: [TypeOrmModule.forFeature([Pegawai])],
  providers: [PegawaiService],
  exports: [PegawaiService],
})
export class PegawaiModule {}
