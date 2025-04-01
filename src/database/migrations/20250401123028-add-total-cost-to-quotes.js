'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('quotes', 'totalCost', {
      type: Sequelize.DECIMAL(10, 2),  
      allowNull: false,               
      defaultValue: 0,                
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('quotes', 'totalCost');
  },
};
