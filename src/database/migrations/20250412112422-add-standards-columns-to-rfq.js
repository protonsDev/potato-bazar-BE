"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("rfqs", "isTpodPercent", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("rfqs", "isUcPercent", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("rfqs", "otherStandards", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    });
    await queryInterface.addColumn("rfqs", "otherStandardPercent", {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("rfqs", "isTpodPercent");
    await queryInterface.removeColumn("rfqs", "isUcPercent");
    await queryInterface.removeColumn("rfqs", "otherStandards");
    await queryInterface.removeColumn("rfqs", "otherStandardPercent");
  },
};
