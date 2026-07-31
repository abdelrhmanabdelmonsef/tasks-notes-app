import { BadRequestException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTasksDto, Priority } from './dto/Create-Tasks.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TasksQueryDto } from './dto/tasks-query.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TasksEntity } from './entities/tasks.entity/tasks.entity';
import { UserEntity } from '../users/entities/users.entity/users.entity';
import { IapiresponseInterface } from '../interfaces/iapiresponse.interface/iapiresponse.interface';


const sortFieldMap = {
    id: 'task.id',
    title: 'task.title',
    completed: 'task.completed',
    priority: 'task.priority',
} as const;



@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TasksEntity)
        private tasksRepository: Repository<TasksEntity>,
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}


    async createTask(
        createTasksDto: CreateTasksDto,
    ): Promise<IapiresponseInterface<TasksEntity> >{
    
        const { user_id, ...taskData } = createTasksDto;
    
        const user = await this.usersRepository.findOne({
            where: { id: user_id },
        });
    
        if (!user) {
            throw new NotFoundException('User not found');
        }
    
        const task = this.tasksRepository.create({
            ...taskData,
            user,
        });
    
        const savedTask = await this.tasksRepository.save(task);
    
        return {
            message: 'Task created',
            data: savedTask,
            status: HttpStatus.CREATED,
        };
    }

    async findAllTasks(tasksQueryDto: TasksQueryDto): Promise<IapiresponseInterface<TasksEntity> > {
        const { completed, priority, page=1, limit=5, sortField='id', sortOrder='asc' } = tasksQueryDto;

        const tasks =  this.tasksRepository.createQueryBuilder('task')
        .leftJoinAndSelect('task.user', 'user')
        if (completed !== undefined) {
            tasks.andWhere('task.completed = :completed', { completed });
        }
        if (priority !== undefined) {
            tasks.andWhere('task.priority = :priority', { priority });
        }
        const orderByField = sortFieldMap[sortField] || 'task.id';

        tasks.orderBy(orderByField, sortOrder === 'asc' ? 'ASC' : 'DESC');
        
        tasks.skip((page - 1) * limit).take(limit);
        
        const [tasksData, total] = await tasks.getManyAndCount();
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        return {
            message: 'Tasks found', 
            data: tasksData, 
            status: HttpStatus.OK, 
            meta: {
                total: total, 
                page: page, 
                limit: limit, 
                totalPages: totalPages, 
                hasNextPage: hasNextPage, 
                hasPreviousPage: hasPreviousPage,
                sortField: sortField,
                sortOrder: sortOrder
            } };
    }
    async findTaskById(id: number): Promise<IapiresponseInterface<TasksEntity> >{
        const task = await this.tasksRepository.findOne({ where: { id }, relations: { user: true } });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        return { message: 'Task found', data: task , status: HttpStatus.OK };
    }   

    async updateTask(
        id: number,
        updateTaskDto: UpdateTaskDto,
    ): Promise<IapiresponseInterface<TasksEntity>> {
        const effectiveFields = Object.entries(updateTaskDto).filter(
            ([, value]) => value !== undefined && value !== '',
        );
        if (effectiveFields.length === 0) {
            throw new BadRequestException(
                'At least one non-empty field is required to update a task',
            );
        }

        const task = await this.tasksRepository.findOne({ where: { id }, relations: { user: true } });

        if (!task) {
            throw new NotFoundException('Task not found');
        }

        await this.tasksRepository.update(id, updateTaskDto);
        const updatedTaskData = await this.tasksRepository.findOne({ where: { id }, relations: { user: true } });
        if (!updatedTaskData) {
            throw new NotFoundException('Task not found');
        }
        return { message: 'Task updated', data: updatedTaskData, status: HttpStatus.OK };
    }

    async deleteTask(id: number): Promise<IapiresponseInterface<TasksEntity> >{
        const task = await this.tasksRepository.findOne({ where: { id }, relations: { user: true } });
        if (!task) {
            throw new NotFoundException('Task not found');
        }
        await this.tasksRepository.delete(id );
        return { message: 'Task deleted', data: task, status: HttpStatus.OK };
    }


}

        // private filteringTasks (tasks:TasksEntity[] , query:TasksQueryDto): TasksEntity[] {
        //     const { completed, priority } = query;
        //     const filteredTasks = tasks.filter(task => task.completed === completed && task.priority === priority);
        //     return filteredTasks;
        // }
    
        // private paginatingTasks (tasks:TasksEntity[] , query:TasksQueryDto): {data: TasksEntity[], total: number, page: number, limit: number, totalPages: number, hasNextPage: boolean, hasPreviousPage: boolean } {
        //     const { page=1, limit=5 } = query;
        //     const startIndex : number = (page - 1) * limit;
        //     const endIndex : number = startIndex + limit;
        //     const paginatedTasks = tasks.slice(startIndex, endIndex);
        //     const totalPages = Math.ceil(tasks.length / limit);
        //     return {data: paginatedTasks,total: tasks.length, page, limit, totalPages, hasNextPage: page < totalPages, hasPreviousPage: page > 1 };
        // }
        // private sortingTasks (tasks:Task[] , query:TasksQueryDto): {data: Task[], meta: {field: string, order: string}} {
        //     const { sortField, sortOrder } = query;
        //     const copiedTasks = [...tasks]; 
        //     if(sortField && sortOrder){
        //         copiedTasks.sort((a, b) => {
        //             if(typeof a[sortField] === 'number' && typeof b[sortField] === 'number'){
        //                 return sortOrder === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
        //             }else if(typeof a[sortField] === 'string' && typeof b[sortField] === 'string'){
        //                 return sortOrder === 'asc' ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
        //             }else{
        //                 return 0;
        //             }
        //         });
        //     }
        //     return {data:copiedTasks,meta:{field:sortField || 'id',order:sortOrder || 'asc'}};
        // }