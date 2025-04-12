"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn("delivery_schedule_quotes", "price_per_quintal", "price_per_kg");

    await queryInterface.addColumn("delivery_schedule_quotes", "for_price_per_kg", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn("delivery_schedule_quotes", "price_per_kg", "price_per_quintal");

    await queryInterface.removeColumn("delivery_schedule_quotes", "for_price_per_kg");
  },
};
