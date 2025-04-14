'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('quotes', 'cost_type', {
      type: Sequelize.ENUM('perKg', 'forPrice'),
      allowNull: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('quotes', 'cost_type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_quotes_cost_type";');
  }
};
