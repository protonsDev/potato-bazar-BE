import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";
import DeliverySchedule from "./delivery_schedule";

class RFQ extends Model {
  public id!: number;
  public buyerId!: number;
  public title!: string;
  public quantity!: number;
  public unitType!: "MT" | "Quintal" | "Kg";
  public targetPrice?: number;
  public potatoVariety?: string;
  public grade?: "Premium" | "Standard" | "Economy";
  public size?: "Small" | "Medium" | "Large" | "Mixed";
  public packagingType?: string;
  public quantityPerBag?: number;
  public paymentTerms!: "Advance" | "COD" | "Credit";
  public customPaymentTerms?: string;
  public remarks?: string;
  public status!: "draft" | "active" | "closed" | "awarded";
  public submissionDeadline?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RFQ.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unitType: {
      type: DataTypes.ENUM("MT", "Quintal", "Kg"),
      allowNull: false,
    },
    targetPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    potatoVariety: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    grade: {
      type: DataTypes.ENUM("Premium", "Standard", "Economy"),
      allowNull: true,
    },
    size: {
      type: DataTypes.ENUM("Small", "Medium", "Large", "Mixed"),
      allowNull: true,
    },
    packagingType: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantityPerBag: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    paymentTerms: {
      type: DataTypes.ENUM("Advance", "COD", "Credit"),
      allowNull: false,
    },
    customPaymentTerms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("draft", "active", "closed", "awarded"),
      defaultValue: "draft",
    },
    submissionDeadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "RFQ",
    tableName: "rfqs",
    timestamps: true,
    underscored: true,
  }
);

// Define relationship with User model
RFQ.belongsTo(User, { foreignKey: "buyerId", as: "buyer" });


export default RFQ;
