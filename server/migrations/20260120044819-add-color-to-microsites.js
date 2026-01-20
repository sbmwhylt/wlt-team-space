"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Microsites", "color", {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: "red",
  });
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Microsites", "color");
}
