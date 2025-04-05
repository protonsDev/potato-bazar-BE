module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("dispatch_status_logs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      dispatch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "dispatch_details",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("dispatch_status_logs");
  },
};
