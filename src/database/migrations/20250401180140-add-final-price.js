module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("quotes", "negotiated_price", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
    });

    await queryInterface.addColumn("quotes", "buyer_status", {
      type: Sequelize.ENUM("accepted", "rejected"),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("quotes", "negotiated_price");
    await queryInterface.removeColumn("quotes", "buyer_status");
  },
};
