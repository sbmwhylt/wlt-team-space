import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Store = sequelize.define(
  "Store",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10, 7), allowNull: false },
    micrositeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "Microsites", key: "id" },
    },
  },
  { timestamps: false, tableName: "Stores" }
);

export default Store;
