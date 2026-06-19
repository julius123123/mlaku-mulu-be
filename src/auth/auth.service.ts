import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PegawaiService } from '../pegawai/pegawai.service';
import { TurisService } from '../turis/turis.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly pegawaiService: PegawaiService,
    private readonly turisService: TurisService,
    private readonly jwtService: JwtService,
  ) {}

  async loginPegawai(dto: LoginDto) {
    const pegawai = await this.pegawaiService.findByEmail(dto.email);
    if (!pegawai) throw new UnauthorizedException('Email atau password salah');

    const valid = await bcrypt.compare(dto.password, pegawai.password);
    if (!valid) throw new UnauthorizedException('Email atau password salah');

    const payload = { sub: pegawai.id, email: pegawai.email, role: 'pegawai' };
    return { access_token: this.jwtService.sign(payload), role: 'pegawai' };
  }

  async loginTuris(dto: LoginDto) {
    const turis = await this.turisService.findByEmail(dto.email);
    if (!turis) throw new UnauthorizedException('Email atau password salah');

    const valid = await bcrypt.compare(dto.password, turis.password);
    if (!valid) throw new UnauthorizedException('Email atau password salah');

    const payload = { sub: turis.id, email: turis.email, role: 'turis' };
    return { access_token: this.jwtService.sign(payload), role: 'turis' };
  }
}
