import RFQ from "../database/models/rfqs";
import DeliverySchedule from "../database/models/delivery_schedule";
import sequelize from "../database/models/db";
import RFQSupplier from "../database/models/rfqSupplier";
import { Op } from "sequelize";
import User from "../database/models/user";
import Quote from "../database/models/quote";
import { notifyUser } from "./notificationService";
import DeliveryScheduleQuote from "../database/models/delivery_schedule_quote";


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
    // Send notification to each supplier
    const suppliers = await User.findAll({
      where: { id: supplierIds },
    });

    await Promise.all(
      suppliers.map((supplier) =>
        notifyUser(
          supplier.id,
          "New RFQ Assigned",
          `You’ve been invited to respond to RFQ #${rfqId}.`,
          "rfq_invitation"
        )
      )
    );

    return createdSuppliers;
  } catch (error: any) {
    throw new Error(`Error adding suppliers: ${error.message}`);
  }
};


export const getSupplierRFQsService = async (
  supplierId,
  page,
  limit,
  search = "",
  variety = ""
) => {
  const offset = (page - 1) * limit;

  const potatoVarietyArray = variety
    ? variety.split(",").map((v) => v.trim())
    : [];

  const rfqWhere: any = {};

  if (search) {
    rfqWhere.title = { [Op.iLike]: `%${search}%` };
  }

  if (potatoVarietyArray.length > 0) {
    rfqWhere.potatoVariety = {
      [Op.in]: potatoVarietyArray,
    };
  }

  const { count, rows } = await RFQSupplier.findAndCountAll({
    where: { supplierId },
    include: [
      {
        model: RFQ,
        as: "rfq",
        where: rfqWhere,
      },
    ],
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  // Extract RFQ IDs
  //@ts-ignore
  const rfqIds = rows.map((row) => row.rfq.id);

  // Fetch all quotes submitted by this supplier for those RFQs
  const submittedQuotes = await Quote.findAll({
    where: {
      supplierId,
      rfqId: {
        [Op.in]: rfqIds,
      },
    },
    attributes: ["id", "rfqId"],
  });

  const quoteMap = new Map<number, number>();
  submittedQuotes.forEach((quote) => {
    quoteMap.set(quote.rfqId, quote.id);
  });

  // Attach `isApplied` and `quoteId`
  const rfqsWithQuoteInfo = rows.map((row) => {
    //@ts-ignore
    const rfq = row.rfq.toJSON();
    const quoteId = quoteMap.get(rfq.id);
    return {
      ...row.toJSON(),
      rfq: {
        ...rfq,
        isApplied: quoteId !== undefined,
        quoteId: quoteId || null,
      },
    };
  });

  return {
    rfqs: rfqsWithQuoteInfo,
    pagination: {
      total: count,
      page,
      pageCount: Math.ceil(count / limit),
    },
  };
};

export const getRFQDetails = async (rfqId: number, supplierId?: number) => {
  try {
    const rfq = await RFQ.findByPk(rfqId, {
      include: [
        {
          model: User,
          as: "buyer",
        },
        {
          model: DeliverySchedule,
          as: "deliverySchedules",
        },
        {
          model: RFQSupplier,
          as: "suppliers",
          attributes: ["supplierId"],
          include: [
            {
              model: User,
              as: "supplier",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!rfq) {
      return { error: true, status: 404, message: "RFQ not found" };
    }

    let quoteId: number | null = null;
    if (supplierId) {
      const existingQuote = await Quote.findOne({
        where: { rfqId, supplierId, status: "submitted" },
        attributes: ["id"],
      });

      quoteId = existingQuote ? existingQuote.id : null;
    }

    return {
      ...rfq.toJSON(),
      isQuote: !!quoteId, 
      quoteId, 
    };
  } catch (err) {
    console.error("Error in getRFQDetails:", err);
    return { error: true, status: 500, message: "Server error" };
  }
};






export const getMyRFQsService = async (buyerId, page, limit, search = "", status = "") => {
  try {
    const offset = (page - 1) * limit;

    const whereClause: any = { buyerId };

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.title = {
        [Op.iLike]: `%${search}%`,
      };
    }

    const { count, rows } = await RFQ.findAndCountAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    // Extract RFQ IDs
    const rfqIds = rows.map((rfq) => rfq.id);

    // Fetch quotes that exist for these RFQs
    const quotes = await Quote.findAll({
      attributes: ["rfqId"],
      where: { rfqId: { [Op.in]: rfqIds } },
      group: ["rfqId"],
    });

    const quotedRFQIds = new Set(quotes.map((q) => q.rfqId));

    // Add isQuote to each RFQ
    const enrichedRFQs = rows.map((rfq) => {
      return {
        ...rfq.toJSON(),
        isQuote: quotedRFQIds.has(rfq.id),
      };
    });

    // Count active RFQs
    const activeRFQsCount = await RFQ.count({
      where: { buyerId, status: "active" },
    });

    // Count total quotes received
    const totalQuotesReceived = await Quote.count({
      include: [
        {
          model: RFQ,
          as: "rfq",
          where: { buyerId },
        },
      ],
    });

    // Calculate average quotes per RFQ
    const averageQuotesPerRFQ = count > 0 ? (totalQuotesReceived / count).toFixed(1) : 0;

    const totalPages = Math.ceil(count / limit);

    return {
      rfqs: enrichedRFQs,
      totalRFQs: count,
      activeRFQs: activeRFQsCount,
      totalQuotesReceived,
      averageQuotesPerRFQ,
      pagination: {
        totalItems: count,
        totalPages,
        currentPage: page,
      },
    };
  } catch (error) {
    throw new Error(`Error fetching RFQs: ${error.message}`);
  }
};


export const updateRFQDB = async (rfqId, updateData) => {
  try {
    console.log("id",rfqId)
    const rfq = await RFQ.findByPk(rfqId);
    if (!rfq) return null;

    const updatedFields = {};
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        updatedFields[key] = updateData[key];
      }
    });

    await rfq.update(updatedFields);

    return rfq;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


export const updateDeliverySchedulesDB = async (deliverySchedules) => {
  try {
    const updatedSchedules = [];

    for (const schedule of deliverySchedules) {
      const { id, ...updateData } = schedule;

      const existingSchedule = await DeliverySchedule.findByPk(id);

      if (!existingSchedule) {
        throw new Error(`Delivery Schedule with ID ${id} not found`);
      }

      await existingSchedule.update(updateData);
      updatedSchedules.push(existingSchedule);
    }

    return updatedSchedules;
  } catch (error) {
    throw error;
  }
};


export const updateSuppliersForRFQ = async (rfqId, supplierIds) => {
  try {
    await RFQSupplier.destroy({ where: { rfqId } });

    const supplierRecords = supplierIds.map((supplierId) => ({
      rfqId,
      supplierId,
    }));

    const updatedSuppliers = await RFQSupplier.bulkCreate(supplierRecords);

    return updatedSuppliers;
  } catch (error) {
    throw new Error(`Error updating suppliers: ${error.message}`);
  }
};

export const getRFQDetailsV2 = async (rfqId: number) => {
  try {
    const rfq = await RFQ.findByPk(rfqId, {
      include: [
        {
          model: User,
          as: "buyer",
        },
        {
          model: DeliverySchedule,
          as: "deliverySchedules",
        },
        {
          model: RFQSupplier,
          as: "suppliers",
          attributes: ["supplierId"],
          include: [
            {
              model: User,
              as: "supplier",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!rfq) {
      return { error: true, status: 404, message: "RFQ not found" };
    }

    let quoteId: number | null = null;
      const existingQuote = await Quote.findOne({
        where: { rfqId, status: "submitted" },
        attributes: ["id"],
      });

      quoteId = existingQuote ? existingQuote.id : null;
    

    return {
      ...rfq.toJSON(),
      isQuote: !!quoteId, 
      quoteId, 
    };
  } catch (err) {
    console.error("Error in getRFQDetails:", err);
    return { error: true, status: 500, message: "Server error" };
  }
};

export const getSupplierRFQsServiceV2 = async (supplierId, search = "") => {
  try {
    const { count, rows } = await RFQSupplier.findAndCountAll({
      where: { supplierId },
      include: [
        {
          model: RFQ,
          as: "rfq",
          where: search
            ? { title: { [Op.iLike]: `%${search}%` } }
            : undefined,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    //@ts-ignore
    const rfqIds = rows.map((rfqSupplier) => rfqSupplier.rfq.id);

    // Fetch only submitted and buyer-accepted quotes
    const submittedQuotes = await Quote.findAll({
      where: {
        rfqId: { [Op.in]: rfqIds },
        supplierId,
        status: "submitted",
        buyerStatus: "accepted",
      },
      attributes: ["rfqId", "id"], // Fetch quoteId
    });

    const quoteMap = new Map(
      submittedQuotes.map((quote) => [quote.rfqId, quote.id])
    );

    // Filter only RFQs which have an accepted quote
    const rfqsWithQuotes = rows
      .filter((rfqSupplier) => {
        //@ts-ignore
        const rfqId = rfqSupplier.rfq.id;
        return quoteMap.has(rfqId);
      })
      .map((rfqSupplier) => {
        //@ts-ignore
        const quoteId = quoteMap.get(rfqSupplier.rfq.id);
        return {
          ...rfqSupplier.toJSON(),
          isQuote: true,
          quoteId,
        };
      });

    return {
      rfqs: rfqsWithQuotes,
    };
  } catch (error) {
    throw new Error(`Error fetching supplier RFQs: ${error.message}`);
  }
};

export const getBuyerRFQDetailsV2 = async (rfqId: number) => {
  try {
    const rfq = await RFQ.findByPk(rfqId, {
      include: [
        {
          model: User,
          as: "buyer",
        },
        {
          model: DeliverySchedule,
          as: "deliverySchedules",
        },
        {
          model: RFQSupplier,
          as: "suppliers",
          attributes: ["supplierId"],
          include: [
            {
              model: User,
              as: "supplier",
              attributes: ["id", "name", "email"],
            },
          ],
        },
      ],
    });

    if (!rfq) {
      return { error: true, status: 404, message: "RFQ not found" };
    }

    // Fetch all quotes for this RFQ
    const allQuotes = await Quote.findAll({
      where: { rfqId },
      include: [
        {
          model: User,
          as: "supplier",
          attributes: ["id", "name", "email"],
        },
        {
          model: DeliveryScheduleQuote,
          as: "deliveryScheduleQuotes", 
          include: [
            {
              model: DeliverySchedule,
              as: "deliverySchedule", 
            },
          ],
        },
      ],
    });

    // Check if any submitted quote exists
    const isQuoteSubmitted = allQuotes.some(q => q.status === "submitted");

    return {
      ...rfq.toJSON(),
      isQuote: isQuoteSubmitted,
      quotes: allQuotes.map(q => q.toJSON()), // optional: format quote objects
    };
  } catch (err) {
    console.error("Error in getBuyerRFQDetailsV2:", err);
    return { error: true, status: 500, message: "Server error" };
  }
};





