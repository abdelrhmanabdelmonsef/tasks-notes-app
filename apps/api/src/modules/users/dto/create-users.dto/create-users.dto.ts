import { IsNotEmpty, IsString } from "class-validator";
import { IsEmail } from "class-validator";



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

}
