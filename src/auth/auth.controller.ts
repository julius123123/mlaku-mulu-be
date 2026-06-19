import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login/pegawai')
  loginPegawai(@Body() dto: LoginDto) {
    return this.authService.loginPegawai(dto);
  }

  @Post('login/turis')
  loginTuris(@Body() dto: LoginDto) {
    return this.authService.loginTuris(dto);
  }
}
