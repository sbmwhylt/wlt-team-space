export async function up(queryInterface, Sequelize) {
  await queryInterface.removeColumn("Microsites", "mapLink");
}
export async function down(queryInterface, Sequelize) {
  await queryInterface.addColumn("Microsites", "mapLink", {
    type: Sequelize.STRING,
    allowNull: true,
  });
}
