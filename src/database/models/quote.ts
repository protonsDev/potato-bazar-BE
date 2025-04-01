import { Model, DataTypes } from "sequelize";
import sequelize from "./db";
import RFQ from "./rfqs";
import User from "./user";

class Quote extends Model {
  public id!: number;
  public rfqId!: number;
  public supplierId!: number;
  public productionCapacity!: number;
  public packagingType!: string;
  public quantityPerPack!: number;
  public paymentTerms!: string;
  public additionalRemarks?: string;
  public termsAndConditions?: string;
  public certifications?: string[];
  public sampleAvailable!: boolean;
  public status!: "draft" | "submitted";
  public totalCost!: number;
  public negotiatedPrice?: number;
  public buyerStatus?:string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Quote.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rfqId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "rfq_id",
    },
    supplierId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "supplier_id",
    },
    productionCapacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "production_capacity",
    },
    packagingType: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "packaging_type",
    },
    quantityPerPack: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "quantity_per_pack",
    },
    paymentTerms: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "payment_terms",
    },
    additionalRemarks: {
      type: DataTypes.TEXT,
      field: "additional_remarks",
    },
    termsAndConditions: {
      type: DataTypes.TEXT,
      field: "terms_and_conditions",
    },
    certifications: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    sampleAvailable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: "sample_available",
    },
    status: {
      type: DataTypes.ENUM("draft", "submitted"),
      allowNull: false,
      defaultValue: "draft",
    },
    totalCost: {
      type: DataTypes.DECIMAL(10, 2),  
      allowNull: false,
      defaultValue: 0,    
      field: "totalCost"            
    },
    negotiatedPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      field: "negotiated_price",
    },
    buyerStatus: {
      type: DataTypes.ENUM("accepted", "rejected"),
      allowNull: true,
      field: "buyer_status",
    },
  },
  {
    sequelize,
    modelName: "Quote",
    tableName: "quotes",
    underscored: true,
    timestamps: true,
  }
);

// Associations
Quote.belongsTo(RFQ, { foreignKey: "rfq_id", as: "rfq" });
Quote.belongsTo(User, { foreignKey: "supplier_id", as: "supplier" });

export default Quote;
