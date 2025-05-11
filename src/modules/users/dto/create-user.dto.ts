import { IsBoolean, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El correo no es válido' })
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener al menos una letra mayúscula, un número y un carácter especial',
  })
  password: string;

  @IsString({ message: 'El nombre es obligatorio' })
  @MinLength(1, { message: 'El nombre es obligatorio' })
  name: string;

  @IsString({ message: 'Los apellidos son obligatorios' })
  @MinLength(1, { message: 'Los apellidos son obligatorios' })
  lastname: string;

  @IsOptional()
  @IsBoolean({ message: "El campo debe ser un boolean" })
  isActive: boolean;
}