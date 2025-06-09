import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  @IsString({ message: 'El nombre del rol debe ser una cadena de texto' })
  name: string;

  @IsOptional()
  @IsString({ message: 'La descripción del rol debe ser una cadena de texto' })
  description: string;

  @IsOptional()
  @IsBoolean({ message: 'El estado del rol debe ser un booleano' })
  isActive: boolean;
}
