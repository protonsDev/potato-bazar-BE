import { Model, DataTypes } from "sequelize";
import sequelize from "./db";

class Invoice extends Model {
  public id!: number;
  public invoiceNumber!: string;
  public quoteId!: number;
  public dispatchId!: number;
  public sellerId!: number;
  public buyerId!: number;
  public invoiceDate!: Date;
  public dueDate!: Date;
  public quantity!: number;
  public pricePerUnit!: number;
  public subtotal!: number;
  public tax!: number;
  public totalAmount!: number;
  public paymentMode!: string;
  public paymentStatus!: string;
  public paymentReference?: string;
  public notes?: string;
  public status!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    invoiceNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      field: "invoice_number",
    },
    quoteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "quote_id",
    },
    dispatchId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "dispatch_id",
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "seller_id",
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "buyer_id",
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "invoice_date",
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "due_date",
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pricePerUnit: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "price_per_unit",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_amount",
    },
    paymentMode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "payment_mode",
    },
    paymentStatus: {
      type: DataTypes.ENUM("PENDING", "PAID", "FAILED", "PARTIALLY_PAID"),
      defaultValue: "PENDING",
      field: "payment_status",
    },
    paymentReference: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "payment_reference",
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("GENERATED", "CANCELLED", "PAID"),
      defaultValue: "GENERATED",
    },
  },
  {
    sequelize,
    modelName: "Invoice",
    tableName: "invoices",
    underscored: true,
    timestamps: true,
  }
);

export default Invoice;
