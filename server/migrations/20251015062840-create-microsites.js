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
    link: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    banner: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    logo: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    aboutDesc: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    footerDesc: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    socialLinks: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    digitalCardOrderLink: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    physicalCardOrderLink: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    // bulkOrderLink: {
    //   type: Sequelize.STRING,
    //   allowNull: true,
    // },
    communityLink: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    mapLink: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    marketingImgs: {
      type: Sequelize.JSON,
      allowNull: true,
    },
    marketingVids: {
      type: Sequelize.JSON,
      allowNull: true,
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
