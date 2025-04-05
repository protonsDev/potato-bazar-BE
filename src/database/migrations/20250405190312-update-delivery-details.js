module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("dispatch_details", "quote_id", {
      type: Sequelize.INTEGER,
      references: {
        model: "quotes",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("dispatch_details", "quote_id");
  },
};
