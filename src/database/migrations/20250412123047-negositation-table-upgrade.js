"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename column "proposed_cost" to "proposed_cost_per_kg"
    await queryInterface.renameColumn("negotiations", "proposed_cost", "proposed_cost_per_kg");

    // Add new column "proposed_cost_for_kg" with nullable constraint
    await queryInterface.addColumn("negotiations", "proposed_cost_for_kg", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, // Temporarily allow null values
    });

    // Add new column "cost_type"
    await queryInterface.addColumn("negotiations", "cost_type", {
      type: Sequelize.ENUM("perKg", "forPrice"),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert column "proposed_cost_per_kg" to "proposed_cost"
    await queryInterface.renameColumn("negotiations", "proposed_cost_per_kg", "proposed_cost");

    // Remove columns "proposed_cost_for_kg" and "cost_type"
    await queryInterface.removeColumn("negotiations", "proposed_cost_for_kg");
    await queryInterface.removeColumn("negotiations", "cost_type");
  }
};
