export async function up(queryInterface, Sequelize) {
  // remove columns
  await queryInterface.removeColumn("Microsites", "facebook");
  await queryInterface.removeColumn("Microsites", "instagram");
  await queryInterface.removeColumn("Microsites", "x");
  await queryInterface.removeColumn("Microsites", "website");
  await queryInterface.removeColumn("Microsites", "youtube");
}
export async function down(queryInterface, Sequelize) {
  // add columns back in case of rollback
  await queryInterface.addColumn("Microsites", "facebook", {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("Microsites", "instagram", {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("Microsites", "x", {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("Microsites", "website", {
    type: Sequelize.STRING,
    allowNull: true,
  });
  await queryInterface.addColumn("Microsites", "youtube", {
    type: Sequelize.STRING,
    allowNull: true,
  });
}
