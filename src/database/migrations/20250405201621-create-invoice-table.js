module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("invoices", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      invoice_number: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      quote_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      dispatch_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      seller_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      buyer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      invoice_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      quantity: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      price_per_unit: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      subtotal: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      tax: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0,
      },
      total_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      payment_mode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.ENUM("PENDING", "PAID", "FAILED", "PARTIALLY_PAID"),
        defaultValue: "PENDING",
      },
      payment_reference: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      notes: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("GENERATED", "CANCELLED", "PAID"),
        defaultValue: "GENERATED",
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("invoices");
  },
};
