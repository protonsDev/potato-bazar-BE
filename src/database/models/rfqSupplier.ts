import { Model, DataTypes } from "sequelize";
import sequelize from "./db"; // adjust if your sequelize instance is in a different path
import RFQ from "./rfqs";
import User from "./user";

class RFQSupplier extends Model {
  public id!: number;
  public rfqId!: number;
  public supplierId!: number;
  public status!: "invited" | "accepted" | "rejected";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RFQSupplier.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rfqId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "rfq_id",
      references: {
        model: "rfqs",
        key: "id",
      },
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "supplier_id",
      references: {
        model: "users",
        key: "id",
      },
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "rfq_supplier",
    tableName: "rfq_suppliers",
    underscored: true,
  }
);

// Associations
RFQSupplier.belongsTo(RFQ, {
  foreignKey: "rfq_id",
  as: "rfq",
});

RFQSupplier.belongsTo(User, {
  foreignKey: "supplier_id",
  as: "supplier",
});

export default RFQSupplier;
