import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Quote from "./quote";
import User from "./user";

class Negotiation extends Model {
  public id!: number;
  public quoteId!: number;
  public proposerId!: number; 
  public proposedBy!: "buyer" | "supplier";
  public proposedCost!: number;
  public status!: "pending" | "accepted" | "rejected";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Negotiation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    quoteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "quote_id",
      references: {
        model: "quotes",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    proposerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "proposer_id",
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    proposedBy: {
      type: DataTypes.ENUM("buyer", "supplier"),
      allowNull: false,
      field: "proposed_by",
    },
    proposedCost: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "proposed_cost",
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Negotiation",
    tableName: "negotiations",
    timestamps: true,
    underscored: true,
  }
);

Negotiation.belongsTo(Quote, { foreignKey: "quoteId", as: "quote" });
Negotiation.belongsTo(User, { foreignKey: "proposerId", as: "proposer" });

export default Negotiation;
