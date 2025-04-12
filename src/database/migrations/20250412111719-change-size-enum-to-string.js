"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("rfqs", "size", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("rfqs", "size", {
      type: Sequelize.ENUM("Small", "Medium", "Large", "Mixed"),
      allowNull: true,
    });
  },
};
