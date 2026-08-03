import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto/login.dto';
import { IapiresponseInterface } from '../interfaces/iapiresponse.interface/iapiresponse.interface';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginResponseDto } from './dto/login.dto/login-response.dto';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}


    async login(loginDto: LoginDto): Promise<IapiresponseInterface<LoginResponseDto>> {
        const user = await this.usersService.findUserByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const payload = { email: user.email, sub: user.id, role: user.role };
        const token = await this.jwtService.signAsync(payload);
        return { message: 'Login successful', data: { token }, status: HttpStatus.OK };
    }
}
