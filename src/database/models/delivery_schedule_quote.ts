import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Quote from "./quote";
import DeliverySchedule from "./delivery_schedule";

class DeliveryScheduleQuote extends Model {
  public id!: number;
  public quoteId!: number;
  public deliveryScheduleId!: number;
  public pricePerQuintal!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

DeliveryScheduleQuote.init(
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
    },
    deliveryScheduleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "delivery_schedule_id",
    },
    pricePerQuintal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "price_per_quintal",
    },
  },
  {
    sequelize,
    modelName: "DeliveryScheduleQuote",
    tableName: "delivery_schedule_quotes",
    underscored: true,
    timestamps: true,
  }
);

DeliveryScheduleQuote.belongsTo(Quote, { foreignKey: "quote_id", as: "quote" });
DeliveryScheduleQuote.belongsTo(DeliverySchedule, { foreignKey: "delivery_schedule_id", as: "deliverySchedule" });

export default DeliveryScheduleQuote;
