import RFQ from "../database/models/rfqs";
import DeliverySchedule from "../database/models/delivery_schedule";
import  sequelize  from "../database/models/db"; 
import RFQSupplier from "../database/models/rfqSupplier";

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

export const addSuppliersToRFQ = async (rfqId: number, supplierIds: number[]) => {
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

