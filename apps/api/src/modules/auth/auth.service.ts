import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto/login.dto';
import { IapiresponseInterface } from '../interfaces/iapiresponse.interface/iapiresponse.interface';
import { UserResponseDto } from '../users/dto/user-response.dto/user-response.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
    ) {}

    async login(loginDto: LoginDto): Promise<IapiresponseInterface<UserResponseDto>> {
        const user = await this.usersService.findUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return { message: 'Login successful', data: user, status: HttpStatus.OK };    
    }
}
