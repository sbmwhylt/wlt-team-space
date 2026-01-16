"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.changeColumn("Stores", "createdAt", {
    type: Sequelize.DATE,
    allowNull: true, // Allow null now
  });
  await queryInterface.changeColumn("Stores", "updatedAt", {
    type: Sequelize.DATE,
    allowNull: true, // Allow null now
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.changeColumn("Stores", "createdAt", {
    type: Sequelize.DATE,
    allowNull: false,
  });
  await queryInterface.changeColumn("Stores", "updatedAt", {
    type: Sequelize.DATE,
    allowNull: false,
  });
}
