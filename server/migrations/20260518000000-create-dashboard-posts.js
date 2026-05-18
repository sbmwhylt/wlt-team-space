"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable("DashboardPosts", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    section: {
      type: Sequelize.ENUM("reminders", "team-meeting", "quote-of-the-week", "staff-updates"),
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    authorId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    authorName: {
      type: Sequelize.STRING,
      allowNull: false,
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
  await queryInterface.dropTable("DashboardPosts");
  await queryInterface.sequelize.query(
    'DROP TYPE IF EXISTS "enum_DashboardPosts_section";'
  );
}
