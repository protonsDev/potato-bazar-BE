import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import DispatchDetail from "./dispatchDetail";

class DispatchStatusLog extends Model {
  public id!: number;
  public dispatchId!: number;
  public status!: string;
  public description!: string;
  public timestamp!: Date;
}

DispatchStatusLog.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dispatchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "dispatch_id",
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "DispatchStatusLog",
    tableName: "dispatch_status_logs",
    timestamps: false,
    underscored: true,
  }
);

DispatchStatusLog.belongsTo(DispatchDetail, {
  foreignKey: "dispatch_id",
  as: "dispatch",
});

DispatchDetail.hasMany(DispatchStatusLog, {
  foreignKey: "dispatch_id",
  as: "statusLogs",
});

export default DispatchStatusLog;
