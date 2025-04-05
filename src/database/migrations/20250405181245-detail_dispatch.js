module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("dispatch_details", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      delivery_schedule_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "delivery_schedules",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      transporter: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      vehicle_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driver_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driver_contact: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      dispatched_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("dispatch_details");
  },
};
