import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUsersDto } from './dto/create-users.dto/create-users.dto';
import { UpdateUsersDto } from './dto/update-user.dto/update-user.dto';



@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}
    @Post()
    createUser(@Body() createUsersDto: CreateUsersDto) {
        return this.usersService.createUser(createUsersDto);
    }

    @Get()
    findAllUsers() {
        return this.usersService.findAllUsers();
    }

    @Get(':id')
    findUserById(@Param('id') id: number) {
        return this.usersService.findUserById(id);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: number) {
        return this.usersService.deleteUser(id);
    }
    @Patch(':id')
    updateUser(@Param('id') id: number, @Body() updateUsersDto: UpdateUsersDto) {
        return this.usersService.updateUser(id, updateUsersDto);
    }
}
