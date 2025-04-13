"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("delivery_schedules", "remark", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("delivery_schedule_quotes", "remark", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("delivery_schedules", "remark");

    await queryInterface.removeColumn("delivery_schedule_quotes", "remark");
  },
};
