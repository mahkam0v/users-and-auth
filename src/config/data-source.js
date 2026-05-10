import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { UserEntity } from "../models/user.entity.js"
import { TodoEntity } from "../models/todo.entity.js"
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: false,
  entities: [UserEntity, TodoEntity],
});
