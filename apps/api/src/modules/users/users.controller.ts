import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-user.dto/update-user.dto';
import { IapiresponseInterface } from '../interfaces/iapiresponse.interface/iapiresponse.interface';
import { UserResponseDto } from './dto/user-response.dto/user-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Post()
    async createUser(@Body() createUsersDto: CreateUsersDto) :Promise<IapiresponseInterface<UserResponseDto>> {
        return await this.usersService.createUser(createUsersDto);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAllUsers() :Promise<IapiresponseInterface<UserResponseDto>> {
        return await this.usersService.findAllUsers();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findUserById(@Param('id') id: number) :Promise<IapiresponseInterface<UserResponseDto>> {
        return await this.usersService.findUserById(id);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: number) :Promise<IapiresponseInterface<UserResponseDto>> {
        return await this.usersService.deleteUser(id);
    }
    @Patch(':id')
    async updateUser(@Param('id') id: number, @Body() updateUsersDto: UpdateUsersDto) :Promise<IapiresponseInterface<UserResponseDto>> {
        return await this.usersService.updateUser(id, updateUsersDto);
    }
}
