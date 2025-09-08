import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;

export default db;
