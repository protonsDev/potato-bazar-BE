module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("rfqs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      unit_type: {
        type: Sequelize.ENUM("MT", "Quintal", "Kg"),
        allowNull: false,
      },
      target_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      potato_variety: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      grade: {
        type: Sequelize.ENUM("Premium", "Standard", "Economy"),
        allowNull: true,
      },
      size: {
        type: Sequelize.ENUM("Small", "Medium", "Large", "Mixed"),
        allowNull: true,
      },
      packaging_type: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      quantity_per_bag: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      payment_terms: {
        type: Sequelize.ENUM("Advance", "COD", "Credit"),
        allowNull: false,
      },
      custom_payment_terms: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("draft", "active", "closed", "awarded"),
        defaultValue: "draft",
      },
      submission_deadline: {
        type: Sequelize.DATE,
        allowNull: true,
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
    await queryInterface.dropTable("rfqs");
  },
};
