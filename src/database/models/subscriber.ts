import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import User from "./user";

class Subscriber extends Model {
  public id!: number;
  public userId!: number;
  public externalUserId!: string;
  public deviceToken!: string;
  public platform!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subscriber.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "user_id",
    },
    externalUserId: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "external_user_id",
    },
    deviceToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "device_token",
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: true,
    },

  },
  {
    sequelize,
    modelName: "Subscriber",
    tableName: "subscribers",
    underscored: true,
    timestamps: true,
  }
);

// Associations
Subscriber.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export default Subscriber;
