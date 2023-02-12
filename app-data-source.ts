import { DataSource } from "typeorm";
import dotenv from 'dotenv';
dotenv.config();

export const myDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ['dist/entity/*.js'],
    logging: true,
    synchronize: true
})