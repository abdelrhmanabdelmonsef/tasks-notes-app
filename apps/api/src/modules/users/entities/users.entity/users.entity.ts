import { TasksEntity } from "src/modules/tasks/entities/tasks.entity/tasks.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Exclude } from "class-transformer";
import { Role } from "src/modules/auth/rolse/rolse.enum";


@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    username!: string;

    @OneToMany(
        () => TasksEntity,
        task => task.user,
    )
    tasks!: TasksEntity[];

    @Column({ unique: true })
    email!: string;

    @Exclude()
    @Column()
    password!: string;

    @Column({ type: 'enum', enum: Role ,default: Role.USER})
    role!: Role ;
}