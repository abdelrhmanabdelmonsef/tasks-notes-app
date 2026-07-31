import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksEntity } from './entities/tasks.entity/tasks.entity';
import { UserEntity } from '../users/entities/users.entity/users.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([TasksEntity , UserEntity]),
  UsersModule,
  ],
  controllers: [TasksController],
  providers: [TasksService ]
})
export class TasksModule {}
