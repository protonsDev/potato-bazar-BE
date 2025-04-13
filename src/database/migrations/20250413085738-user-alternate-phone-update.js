"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("users", "alternate_phone", {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("users", "alternate_phone");
  },
};
