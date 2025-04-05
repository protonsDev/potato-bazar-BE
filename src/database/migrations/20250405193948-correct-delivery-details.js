'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Remove old column
    await queryInterface.removeColumn('dispatch_details', 'delivery_schedule_id');

    // 2. Add new column
    await queryInterface.addColumn('dispatch_details', 'delivery_schedule_quote_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'delivery_schedule_quotes',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Remove new column
    await queryInterface.removeColumn('dispatch_details', 'delivery_schedule_quote_id');

    // 2. Add back the old column
    await queryInterface.addColumn('dispatch_details', 'delivery_schedule_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'delivery_schedules',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  }
};
