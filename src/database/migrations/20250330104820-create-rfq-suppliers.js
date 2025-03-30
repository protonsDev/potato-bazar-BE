'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rfq_suppliers', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      rfq_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rfqs', 
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addConstraint('rfq_suppliers', {
      fields: ['rfq_id', 'supplier_id'],
      type: 'unique',
      name: 'unique_rfq_supplier_pair'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rfq_suppliers');
  }
};
