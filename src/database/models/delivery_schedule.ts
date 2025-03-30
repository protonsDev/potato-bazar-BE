import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import RFQ from "./rfqs";

class DeliverySchedule extends Model {
  public id!: number;
  public rfqId!: number;
  public deliveryLocation!: string;
  public quantity!: number;
  public deliveryDeadline!: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DeliverySchedule.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rfqId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: RFQ,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    deliveryLocation: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    deliveryDeadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DeliverySchedule",
    tableName: "delivery_schedules",
    timestamps: true,
    underscored: true,
  }
);

// Define relationship
DeliverySchedule.belongsTo(RFQ, { foreignKey: "rfqId", as: "rfq" });

export default DeliverySchedule;
