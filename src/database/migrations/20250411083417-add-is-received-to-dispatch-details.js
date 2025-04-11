'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('dispatch_details', 'is_received', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('dispatch_details', 'is_received');
  },
};
