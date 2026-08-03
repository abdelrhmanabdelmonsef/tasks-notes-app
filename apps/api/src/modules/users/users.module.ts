import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/users.entity/users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { RolesGuard } from '../auth/guards/RolesGuard.gurad';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  exports: [TypeOrmModule, UsersService],
  providers: [UsersService, RolesGuard],
  controllers: [UsersController],
  
})
export class UsersModule {}
