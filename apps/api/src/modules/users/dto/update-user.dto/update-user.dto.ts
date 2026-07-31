import { IsEmail, IsOptional, IsString } from "class-validator";


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
}