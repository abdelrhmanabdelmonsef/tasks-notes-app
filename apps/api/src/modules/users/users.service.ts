import { Injectable, NotFoundException, HttpStatus, BadRequestException  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity/users.entity';
import { Repository } from 'typeorm';
import { CreateUsersDto } from './dto/create-users.dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-user.dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto/user-response.dto';
import { IapiresponseInterface } from '../interfaces/iapiresponse.interface/iapiresponse.interface';


@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    async createUser(createUsersDto: CreateUsersDto): Promise<IapiresponseInterface<UserResponseDto>> {
        const user = this.usersRepository.create(createUsersDto);
        const savedUser = await this.usersRepository.save(user);
        return { message: 'User created successfully', data: savedUser, status: HttpStatus.CREATED };
    }

    async findAllUsers(): Promise<IapiresponseInterface<UserResponseDto>> {
        const users = await this.usersRepository.find();
        return { message: 'Users fetched successfully', data: users, status: HttpStatus.OK };
    }
    async findUserById(id: number): Promise<IapiresponseInterface<UserResponseDto>> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return { message: 'User found successfully', data: user, status: HttpStatus.OK };
    }
    async deleteUser(id: number): Promise<IapiresponseInterface<UserResponseDto>> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.usersRepository.delete(id);
        return { message: 'User deleted successfully', data: user, status: HttpStatus.OK };
    }
    
    async updateUser(
        id: number,
        updateUsersDto: UpdateUsersDto,
    ): Promise<IapiresponseInterface<UserResponseDto>> {
        const effectiveFields = Object.entries(updateUsersDto).filter(
            ([, value]) => value !== undefined && value !== '',
        );
        if (effectiveFields.length === 0) {
            throw new BadRequestException(
                'At least one non-empty field is required to update a user',
            );
        }

        const user = await this.usersRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        await this.usersRepository.update(id, updateUsersDto);
        const updatedUserData = await this.usersRepository.findOne({ where: { id } });
        if (!updatedUserData) {
            throw new NotFoundException('User not found');
        }

        return { message: 'User updated successfully', data: updatedUserData, status: HttpStatus.OK };
    }

} 
