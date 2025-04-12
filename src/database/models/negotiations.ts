import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Quote from "./quote";
import User from "./user";

class Negotiation extends Model {
  public id!: number;
  public quoteId!: number;
  public proposerId!: number; 
  public proposedBy!: "buyer" | "supplier";
  public proposedCostPerKg!: number;  // Cost per kg for the proposed offer
  public proposedCostForKg!: number;  // For other proposed price, in terms of price per kg
  public costType!: "perKg" | "forPrice";  // To identify which cost is being proposed
  public status!: "pending" | "accepted" | "rejected";
  public message!: string;
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
    proposedCostPerKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "proposed_cost_per_kg",  
    },
    proposedCostForKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "proposed_cost_for_kg", 
    },
    costType: {
      type: DataTypes.ENUM("perKg", "forPrice"),
      allowNull: true,
      field: "cost_type",
    },
    status: {
      type: DataTypes.ENUM("pending", "accepted", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    message: {
      type: DataTypes.STRING,
      allowNull: true,
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
