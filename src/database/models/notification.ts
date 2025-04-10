import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";

class Notification extends Model {
  public id!: number;
  public userId!: number;
  public title!: string;
  public message!: string;
  public read!: boolean;
  public type!: string;
  public status!: "SENT" | "FAILED";
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id", // 👈 maps to DB column
      references: {
        model: "users",
        key: "id",
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("SENT", "FAILED"),
      allowNull: false,
      defaultValue: "SENT",
    },
  },
  {
    sequelize,
    modelName: "Notification",
    tableName: "notifications",
    underscored: true, // 👈 must be true to match created_at / updated_at
    timestamps: true,
  }
);

Notification.belongsTo(User, {
  foreignKey: "userId", // this is the JS-side key
  as: "user",
});

export default Notification;
