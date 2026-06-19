import { IsDateString, IsOptional } from 'class-validator';

export class UpdatePerjalananDto {
  @IsOptional()
  @IsDateString()
  tanggalMulaiPerjalanan?: string;

  @IsOptional()
  @IsDateString()
  tanggalBerakhirPerjalanan?: string;

  @IsOptional()
  destinasiPerjalanan?: string | Record<string, unknown>;
}
