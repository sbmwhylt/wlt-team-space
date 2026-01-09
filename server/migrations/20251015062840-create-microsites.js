"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("Microsites", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    slug: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "consumer",
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    banner: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    aboutDesc: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    socialLinks: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: "{}",
    },
    digitalCardOrderLink: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    physicalCardOrderLink: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    communityLink: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    mapLink: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    marketingImgs: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: "[]",
    },
    marketingVids: {
      type: Sequelize.JSON,
      allowNull: true,
      defaultValue: "[]",
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable("Microsites");
}
