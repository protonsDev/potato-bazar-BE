module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("delivery_schedules", {
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
          model: "rfqs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      delivery_location: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      delivery_deadline: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("delivery_schedules");
  },
};
