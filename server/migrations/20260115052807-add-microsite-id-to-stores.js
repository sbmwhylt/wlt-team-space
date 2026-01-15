"use strict";

export async function up(queryInterface, Sequelize) {
  await queryInterface.addColumn("Stores", "micrositeId", {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: "Microsites",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  });

  await queryInterface.addIndex("Stores", ["micrositeId"]);
}
export async function down(queryInterface) {
  await queryInterface.removeIndex("Stores", ["micrositeId"]);
  await queryInterface.removeColumn("Stores", "micrositeId");
}
