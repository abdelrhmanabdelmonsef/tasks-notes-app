import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto/login.dto';

@Injectable()
export class AuthService {

    
    login(loginDto: LoginDto){
        return {
            message: 'Register successful',
            data: {
                email: loginDto.email,
                password: loginDto.password,
            },
        };
    }
}
