"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change grade column to STRING (cast from ENUM to TEXT to STRING)
    await queryInterface.changeColumn("rfqs", "grade", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Drop the enum type from PostgreSQL if it exists
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_rfqs_grade') THEN
          DROP TYPE "enum_rfqs_grade";
        END IF;
      END$$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Recreate ENUM type for grade
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_rfqs_grade" AS ENUM ('Premium', 'Standard', 'Economy');
    `);

    // Change grade column back to ENUM
    await queryInterface.changeColumn("rfqs", "grade", {
      type: Sequelize.ENUM("Premium", "Standard", "Economy"),
      allowNull: true,
    });
  },
};
