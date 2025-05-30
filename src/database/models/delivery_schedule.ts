import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import RFQ from "./rfqs";

class DeliverySchedule extends Model {
  public id!: number;
  public rfqId!: number;
  public deliveryLocation!: string;
  public quantity!: number;
  public deliveryDeadline!: Date;
  public startDate!: Date;
  public remark?: string;
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
        model: "rfqs", 
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
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    }    
  },
  {
    sequelize,
    modelName: "DeliverySchedule",
    tableName: "delivery_schedules",
    timestamps: true,
    underscored: true,
  }
);

DeliverySchedule.belongsTo(RFQ, { foreignKey: "rfqId", as: "rfq" });
RFQ.hasMany(DeliverySchedule, { foreignKey: "rfqId", as: "deliverySchedules" });

export default DeliverySchedule;
