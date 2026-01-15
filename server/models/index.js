import { Sequelize } from "sequelize";
import sequelize from "../config/db.js";

import User from "./User.js";
import Microsite from "./Microsites.js";
import Store from "./Store.js"; 

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = User;
db.Microsite = Microsite;
db.Store = Store;

// Associations
Microsite.hasMany(Store, { foreignKey: "micrositeId", as: "stores" });
Store.belongsTo(Microsite, { foreignKey: "micrositeId", as: "microsite" });

export default db;
