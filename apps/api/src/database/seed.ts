import 'reflect-metadata';
import { config } from 'dotenv';
import { resolve } from 'path';
import { DataSource, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../modules/users/entities/users.entity/users.entity';
import { TasksEntity } from '../modules/tasks/entities/tasks.entity/tasks.entity';
import { seedUsers, seedTasks } from './seed-data';

config({ path: resolve(__dirname, '../../.env') });

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    username: process.env.DB_USERNAME ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ?? 'tasks_db',
    entities: [UserEntity, TasksEntity],
    synchronize: false,
});

async function seed() {
    await AppDataSource.initialize();

    const userRepo = AppDataSource.getRepository(UserEntity);
    const taskRepo = AppDataSource.getRepository(TasksEntity);

    const seedEmails = seedUsers.map((u) => u.email);
    const existingSeedUsers = await userRepo.find({ where: { email: In(seedEmails) } });
    const existingByEmail = new Map(existingSeedUsers.map((u) => [u.email, u]));

    const userBySeedRef = new Map<number, UserEntity>();

    for (const { seedRef, username, email, password } of seedUsers) {
        const existing = existingByEmail.get(email);
        if (existing) {
            userBySeedRef.set(seedRef, existing);
            console.log(`User already exists: ${email} (seedRef: ${seedRef}, db id: ${existing.id})`);
            continue;
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = userRepo.create({ username, email, password: hashedPassword });
        const saved = await userRepo.save(user);
        userBySeedRef.set(seedRef, saved);
        console.log(`Created user: ${email} (seedRef: ${seedRef}, db id: ${saved.id})`);
    }

    const seedUserIds = [...userBySeedRef.values()].map((u) => u.id);
    const existingTaskCount = await taskRepo
        .createQueryBuilder('task')
        .where('task.user_id IN (:...ids)', { ids: seedUserIds })
        .andWhere('task.title IN (:...titles)', { titles: seedTasks.map((t) => t.title) })
        .getCount();

    if (existingTaskCount >= seedTasks.length) {
        console.log('Seed tasks already exist — skipping task insert.');
        await AppDataSource.destroy();
        return;
    }

    for (const { user_id, ...taskData } of seedTasks) {
        const user = userBySeedRef.get(user_id);
        if (!user) {
            throw new Error(`User not found for seedRef: ${user_id}`);
        }

        const alreadyExists = await taskRepo.findOne({
            where: { title: taskData.title, user: { id: user.id } },
            relations: { user: true },
        });
        if (alreadyExists) {
            console.log(`Task already exists: ${taskData.title} (user_id seedRef: ${user_id})`);
            continue;
        }

        const task = taskRepo.create({ ...taskData, user });
        await taskRepo.save(task);
        console.log(`Created task: ${taskData.title} (user_id seedRef: ${user_id}, db user id: ${user.id})`);
    }

    console.log('Seed completed successfully.');
    await AppDataSource.destroy();
}

seed().catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
});
