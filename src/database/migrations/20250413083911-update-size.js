"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Change unit_type to STRING (temporary cast from ENUM to TEXT to STRING)
    await queryInterface.changeColumn("rfqs", "unit_type", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    // Drop the enum type from PostgreSQL manually
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_rfqs_unit_type') THEN
          DROP TYPE "enum_rfqs_unit_type";
        END IF;
      END$$;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Recreate ENUM type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_rfqs_unit_type" AS ENUM ('MT', 'Quintal', 'Kg', 'Ton');
    `);

    // Change unit_type back to ENUM
    await queryInterface.changeColumn("rfqs", "unit_type", {
      type: Sequelize.ENUM("MT", "Quintal", "Kg", "Ton"),
      allowNull: false,
    });
  },
};
