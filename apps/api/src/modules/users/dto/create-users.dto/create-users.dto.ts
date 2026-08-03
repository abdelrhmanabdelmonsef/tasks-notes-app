import {  IsEnum, IsNotEmpty, IsString } from "class-validator";
import { IsEmail } from "class-validator";
import { Role } from "src/modules/auth/rolse/rolse.enum";



export class CreateUsersDto {

    @IsString()
    @IsNotEmpty()
    username!: string;

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email!: string;

    @IsString()
    @IsNotEmpty()
    password!: string;

    @IsEnum(Role , { message: 'Role must be a valid enum value' })
    role!: Role;

}
