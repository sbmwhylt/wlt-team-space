import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";
import User from "./User.js";
import Microsite from "./Microsites.js";

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.User = User;
db.Microsite = Microsite;

export default db;
