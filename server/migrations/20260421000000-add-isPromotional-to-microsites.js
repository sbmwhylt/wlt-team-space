"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Microsites", "isPromotional", {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Microsites", "isPromotional");
}
