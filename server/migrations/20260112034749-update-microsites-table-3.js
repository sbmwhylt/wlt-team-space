"use strict";

/** @type {import('sequelize-cli').Migration} */
export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Microsites", "physicalImg", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("Microsites", "digitalImg", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("Microsites", "physicalBulkImg", {
    type: Sequelize.STRING,
    allowNull: true,
  });

  await queryInterface.addColumn("Microsites", "digitalBulkImg", {
    type: Sequelize.STRING,
    allowNull: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Microsites", "physicalImg");
  await queryInterface.removeColumn("Microsites", "digitalImg");
  await queryInterface.removeColumn("Microsites", "physicalBulkImg");
  await queryInterface.removeColumn("Microsites", "digitalBulkImg");
}
