'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('quotes', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      rfq_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rfqs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      supplier_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      production_capacity: {
        type: Sequelize.INTEGER, 
        allowNull: false,
      },
      packaging_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity_per_pack: {
        type: Sequelize.INTEGER, 
        allowNull: false,
      },
      payment_terms: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      additional_remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      terms_and_conditions: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      certifications: {
        type: Sequelize.ARRAY(Sequelize.STRING), 
        allowNull: true,
      },
      sample_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      status: {
        type: Sequelize.ENUM('draft', 'submitted'),
        defaultValue: 'draft',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('quotes');
  },
};
