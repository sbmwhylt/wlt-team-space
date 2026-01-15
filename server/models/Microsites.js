import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import slugify from "slugify"; 

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
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "consumer",
      validate: {
        isIn: [["consumer", "business"]],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isNumeric: true,
      },
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aboutDesc: {
      type: DataTypes.TEXT,
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
    communityLink: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    mapLink: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    businessLink: {
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
    physicalImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    digitalImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    physicalBulkImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    digitalBulkImg: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

Microsite.beforeValidate((microsite) => {
  if (!microsite.slug && microsite.name) {
    microsite.slug = slugify(microsite.name, { lower: true, strict: true });
  }
});

export default Microsite;
