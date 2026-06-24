import pkg from "sequelize";
const { Sequelize } = pkg;
import sequelize from "../config/db.js";

import User from "./User.js";
import Microsite from "./Microsites.js";
import Store from "./Store.js";
import NoticePost from "./NoticePost.js";
import DashboardPost from "./DashboardPost.js";

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models
db.User = User;
db.Microsite = Microsite;
db.Store = Store;
db.NoticePost = NoticePost;
db.DashboardPost = DashboardPost;

// Associations
Microsite.hasMany(Store, { foreignKey: "micrositeId", as: "stores", onDelete: "CASCADE" });
Store.belongsTo(Microsite, { foreignKey: "micrositeId", as: "microsite" });

User.hasMany(NoticePost, { foreignKey: "authorId", as: "noticePosts", onDelete: "CASCADE" });
NoticePost.belongsTo(User, { foreignKey: "authorId", as: "author" });

User.hasMany(DashboardPost, { foreignKey: "authorId", as: "dashboardPosts", onDelete: "CASCADE" });
DashboardPost.belongsTo(User, { foreignKey: "authorId", as: "author" });

export default db;
