'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('delivery_schedules', 'start_date', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(), 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('delivery_schedules', 'start_date');
  },
};
