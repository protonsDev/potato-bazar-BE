import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import bcrypt from "bcryptjs";

class User extends Model {
  public id!: number;
  public email!: string;
  public passwordHash!: string;
  public name!: string;
  public phone!: string;
  public role!: "buyer" | "seller";
  public companyName?: string;
  public address?: string;
  public gstin?: string;
  public isVerified!: boolean;
  public isActive!: boolean;
  public alternatePhone?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Password validation function
  async validPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.passwordHash);
  }
}

// Define the model schema
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role: {
      type: DataTypes.ENUM("buyer", "seller"),
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gstin: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    alternatePhone: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "alternate_phone",
    },    
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
    timestamps: true,
    underscored: true,
  }
);

// Hash password before saving a user
User.beforeCreate(async (user: User) => {
  if (user.passwordHash) {
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
  }
});

export default User;
