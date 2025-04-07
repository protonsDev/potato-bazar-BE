'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('invoices', 'dispatch_id');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('invoices', 'dispatch_id', {
      type: Sequelize.INTEGER,
      allowNull: false, // or true if needed
    });
  },
};
