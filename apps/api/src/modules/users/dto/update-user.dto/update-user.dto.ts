import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator";
import { Role } from "src/modules/auth/rolse/rolse.enum";


export class UpdateUsersDto {
    @IsString()
    @IsOptional()
    username?: string;
    @IsEmail()
    @IsOptional()
    email?: string;
    @IsString()
    @IsOptional()
    password?: string;
    @IsEnum(Role)
    @IsOptional()
    role?: Role;
}