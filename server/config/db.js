import pkg from "sequelize";
const { Sequelize } = pkg;

const isLocal = process.env.DATABASE_URL.includes("localhost");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
  dialectOptions: {
    ssl: isLocal ? false : { rejectUnauthorized: false },
  },
});

export default sequelize;
