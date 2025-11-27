import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const isLocal = process.env.DATABASE_URL.includes("localhost");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: isLocal ? false : { rejectUnauthorized: false }, 
  },
});

export default sequelize;
