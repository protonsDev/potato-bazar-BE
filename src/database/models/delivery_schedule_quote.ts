import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import Quote from "./quote";
import DeliverySchedule from "./delivery_schedule";

class DeliveryScheduleQuote extends Model {
  public id!: number;
  public quoteId!: number;
  public deliveryScheduleId!: number;
  public pricePerKg!: number; 
  public forPricePerKg!: number; 
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
    pricePerKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "price_per_kg",
    },
    forPricePerKg: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "for_price_per_kg", 
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
Quote.hasMany(DeliveryScheduleQuote, {
  foreignKey: "quote_id",
  as: "deliveryScheduleQuotes",
});
export default DeliveryScheduleQuote;
