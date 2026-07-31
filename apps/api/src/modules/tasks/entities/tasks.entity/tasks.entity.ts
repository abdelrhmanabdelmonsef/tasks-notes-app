import { UserEntity } from "src/modules/users/entities/users.entity/users.entity";
import { Priority } from "../../dto/Create-Tasks.dto";
import { Column, ManyToOne, JoinColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('tasks')
export class TasksEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ nullable: false })
    title!: string;

    @Column({ nullable: true })
    description?: string;

    @Column({ default: false })
    completed!: boolean;

    @Column({
        type: 'enum',
        enum: Priority,
        default: Priority.MEDIUM,
    })
    priority!: Priority;

    @ManyToOne(
        () => UserEntity,
        user => user.tasks,
        {
            nullable: false,
            onDelete: 'RESTRICT',
        },
    )
    @JoinColumn({ name: 'user_id' })
    user!: UserEntity;
}