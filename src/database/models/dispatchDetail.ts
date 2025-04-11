import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Quote from "./quote";
import DeliveryScheduleQuote from "./delivery_schedule_quote";

class DispatchDetail extends Model {
  public id!: number;
  public deliveryScheduleQuoteId!: number;
  public quoteId!: number;
  public transporter!: string;
  public vehicleNumber!: string;
  public driverName!: string;
  public driverContact!: string;
  public notes?: string;
  public dispatchedAt?: Date;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public isReceived!: boolean;
  public isRejected!: boolean;


}

DispatchDetail.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    deliveryScheduleQuoteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "delivery_schedule_quote_id",
    },
    quoteId: {
      type: DataTypes.INTEGER,
      field: "quote_id",
    },
    transporter: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "vehicle_number",
    },
    driverName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "driver_name",
    },
    driverContact: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "driver_contact",
    },
    notes: {
      type: DataTypes.TEXT,
    },
    dispatchedAt: {
      type: DataTypes.DATE,
      field: "dispatched_at",
      defaultValue: DataTypes.NOW,
    },
    isReceived: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "is_received",
      defaultValue: false,
    },
    isRejected:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
      field: "is_rejected",
      defaultValue: false,
    }
  },
  {
    sequelize,
    modelName: "DispatchDetail",
    tableName: "dispatch_details",
    underscored: true,
    timestamps: true,
  }
);

// Associations
DispatchDetail.belongsTo(DeliveryScheduleQuote, {
  foreignKey: "delivery_schedule_quote_id",
  as: "deliveryScheduleQuote",
});

DispatchDetail.belongsTo(Quote, {
  foreignKey: "quote_id",
  as: "quote",
});

DeliveryScheduleQuote.hasMany(DispatchDetail, {
  foreignKey: "delivery_schedule_quote_id",
  as: "dispatchDetails",
});

export default DispatchDetail;
