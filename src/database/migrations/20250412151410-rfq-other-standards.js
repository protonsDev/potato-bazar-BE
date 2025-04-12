'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('rfqs', 'otherStandards');
    await queryInterface.addColumn('rfqs', 'otherStandards', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('rfqs', 'otherStandards');
    await queryInterface.addColumn('rfqs', 'otherStandards', {
      type: Sequelize.DECIMAL(5, 2),
      allowNull: true,
    });
  },
};
