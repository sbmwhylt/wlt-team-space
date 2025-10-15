import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Microsite = sequelize.define(
  "Microsite",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "consumer",
      validate: {
        isIn: [["consumer", "business"]],
      },
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    logo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aboutDesc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    footerDesc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    socialLinks: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {},
    },
    digitalCardOrderLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    physicalCardOrderLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    //   bulkOrderLink: {
    //     type: DataTypes.STRING,
    //     allowNull: true,
    //   },
    communityLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mapLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    marketingImgs: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
    marketingVids: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    timestamps: true,
  }
);

export default Microsite;