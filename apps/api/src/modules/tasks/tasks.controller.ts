import { Controller, Post, Body, Query, Get, Param, ParseIntPipe, Patch, Delete, UseGuards } from '@nestjs/common';
import { CreateTasksDto } from './dto/Create-Tasks.dto';
import { TasksService } from './tasks.service';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksQueryDto } from './dto/tasks-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/interfaces/jwtPayload.interface';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) {}
    @Post()
    async createTask(@Body() createTasksDto: CreateTasksDto) {
        return await this.tasksService.createTask(createTasksDto);
    }

    @Get()
    async findAllTasks(@Query() tasksQueryDto: TasksQueryDto , @CurrentUser() user: JwtPayload) {
        return this.tasksService.findAllTasks(tasksQueryDto, user);
    }

    @Get(':id')
    async findTaskById(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.findTaskById(id);
    }

    @Patch(':id')
    async updateTask(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: UpdateTaskDto) {
        return await this.tasksService.updateTask(id, updateTaskDto);
    }

    @Delete(':id')
    async deleteTask(@Param('id', ParseIntPipe) id: number) {
        return this.tasksService.deleteTask(id);
    }
}
