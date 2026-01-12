"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Microsites", "businessLink", {
    type: Sequelize.STRING,
    allowNull: true, // Can be empty
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Microsites", "business-link");
}
