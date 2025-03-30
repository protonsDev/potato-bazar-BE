import RFQ from "../database/models/rfqs";
import DeliverySchedule from "../database/models/delivery_schedule";
import sequelize from "../database/models/db";
import RFQSupplier from "../database/models/rfqSupplier";
import { Op } from "sequelize";
import User from "../database/models/user";


export const createRFQDB = async (rfqData) => {
  const transaction = await sequelize.transaction();
  try {
    const { deliverySchedules, ...rfqDetails } = rfqData;

    // Create RFQ
    const rfq = await RFQ.create(rfqDetails, { transaction });

    // Create Delivery Schedules
    if (deliverySchedules && deliverySchedules.length > 0) {
      await DeliverySchedule.bulkCreate(
        deliverySchedules.map((schedule) => ({
          ...schedule,
          rfqId: rfq.id,
        })),
        { transaction }
      );
    }

    await transaction.commit();
    return rfq;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getRFQsDB = async (page, limit) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await RFQ.findAndCountAll({
    include: [{ model: DeliverySchedule, as: "deliverySchedules" }],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    rfqs: rows,
    totalRecords: count,
    totalPages: Math.ceil(count / limit),
  };
};

export const getRFQByIdDB = async (id) => {
  return await RFQ.findByPk(id, {
    include: [{ model: DeliverySchedule, as: "deliverySchedules" }],
  });
};

export const addSuppliersToRFQ = async (
  rfqId: number,
  supplierIds: number[]
) => {
  try {
    const supplierRecords = supplierIds.map((supplierId) => ({
      rfqId,
      supplierId,
    }));

    const createdSuppliers = await RFQSupplier.bulkCreate(supplierRecords);

    return createdSuppliers;
  } catch (error) {
    throw new Error(`Error adding suppliers: ${error.message}`);
  }
};

export const getSupplierRFQsService = async (
  supplierId,
  page,
  limit,
  search = ""
) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows } = await RFQSupplier.findAndCountAll({
      where: {
        supplierId,
      },
      include: [
        {
          model: RFQ,
          as: "rfq",
          where: search
            ? {
                title: {
                  [Op.iLike]: `%${search}%`,
                },
              }
            : undefined,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      rfqs: rows,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    throw new Error(`Error adding suppliers: ${error.message}`);
  }
};



export const getRFQDetails = async (rfqId: number) => {
  try {
   return await RFQ.findByPk(rfqId, {
      include: [
        {
          model: User,
          as: "buyer",
        },
        {
          model: DeliverySchedule,
          as: "deliverySchedules",
        },
      ],
    });


  } catch (err) {
    console.error("Error in getRFQDetails:", err);
    return { error: true, status: 500, message: "Server error" };
  }
};

