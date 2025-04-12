"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop potato_variety and re-add as array
    await queryInterface.removeColumn("rfqs", "potato_variety");
    await queryInterface.addColumn("rfqs", "potato_variety", {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });

    // Drop and re-add unitType with updated ENUM
    await queryInterface.changeColumn("rfqs", "unit_type", {
      type: Sequelize.ENUM("MT", "Quintal", "Kg", "Ton"),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert potato_variety back to single string
    await queryInterface.removeColumn("rfqs", "potato_variety");
    await queryInterface.addColumn("rfqs", "potato_variety", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Revert unitType ENUM (old values only)
    await queryInterface.changeColumn("rfqs", "unit_type", {
      type: Sequelize.ENUM("MT", "Quintal", "Kg"), // original values
      allowNull: false,
    });
  },
};
