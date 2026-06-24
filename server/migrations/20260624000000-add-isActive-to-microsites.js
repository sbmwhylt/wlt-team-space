"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Microsites", "isActive", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Microsites", "isActive");
}
