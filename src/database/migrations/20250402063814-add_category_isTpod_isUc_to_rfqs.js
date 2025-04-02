"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("rfqs", "category", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("rfqs", "isTpod", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });

    await queryInterface.addColumn("rfqs", "isUc", {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("rfqs", "category");
    await queryInterface.removeColumn("rfqs", "isTpod");
    await queryInterface.removeColumn("rfqs", "isUc");
  },
};
