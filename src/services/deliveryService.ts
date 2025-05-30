import { Model } from "sequelize";
import DeliverySchedule from "../database/models/delivery_schedule";
import DeliveryScheduleQuote from "../database/models/delivery_schedule_quote";
import Dispatch from "../database/models/dispatchDetail";
import DispatchStatusLog from "../database/models/dispatchStatusLog";
import Quote from "../database/models/quote";
import RFQ from "../database/models/rfqs";
import { Op } from "sequelize";


// Dispatch Services
export const createDispatchService = async (data) => await Dispatch.create(data);
export const getDispatchByIdService = async (id) => await Dispatch.findByPk(id);
export const getAllDispatchesService = async () => await Dispatch.findAll();
export const updateDispatchService = async (id, updates) => {
  const dispatch = await Dispatch.findByPk(id);
  if (!dispatch) throw new Error("Dispatch not found");
  await dispatch.update(updates);
  return dispatch;
};
export const deleteDispatchService = async (id) => {
  const dispatch = await Dispatch.findByPk(id);
  if (!dispatch) throw new Error("Dispatch not found");
  await dispatch.destroy();
};

export const getQuoteDetails = async (quoteId) =>{
  try{
   return  await Quote.findByPk(quoteId);
  } catch(error){
    throw error;
  }
}

// Status Log Services
export const createStatusLogService = async (data) => await DispatchStatusLog.create(data);
export const getLogsByDispatchIdService = async (dispatchId) =>
  await DispatchStatusLog.findAll({ where: { dispatchId }, order: [["timestamp", "ASC"]] });
export const deleteStatusLogService = async (id) => {
  const log = await DispatchStatusLog.findByPk(id);
  if (!log) throw new Error("Log not found");
  await log.destroy();
};
export const getQuoteWithFullDetails = async ({  dispatchId }) => {
  // const quoteData = await Quote.findAll({
  //   where: { id: quoteId },
  //   include: [
  //     {
  //       model: DeliveryScheduleQuote,
  //       as: "deliveryScheduleQuotes",
  //       include: [
  //         {
  //           model: DeliverySchedule,
  //           as: "deliverySchedule",
  //         },
  //         {
  //           model: Dispatch,
  //           as: "dispatchDetails",
  //           where:{id:dispatchId},
  //           include: [
  //             {
  //               model: DispatchStatusLog,
  //               as: "statusLogs",
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //   ],
  // });

  const dispatchData = await Dispatch.findAll({
    where:{id:dispatchId},
    include:[
      {
        model:DeliveryScheduleQuote,
        as:"deliveryScheduleQuote",
        include:[
          {
            model:DeliverySchedule,
            as:"deliverySchedule"
          }
        ]
      },
        {
                      model: DispatchStatusLog,
                      as: "statusLogs",
        },

    ]
  });

  return dispatchData;
};

export const getQuoteDeliverySchedule = async (rfqId,sellerId) =>{
  try{

    const quote = await Quote.findOne({
      where: {
        rfqId: rfqId,
        supplierId: sellerId,
        buyerStatus: 'accepted'
      }
    });
    
    if (!quote) return [];
    
    return await DeliveryScheduleQuote.findAll({
      where: { quoteId: quote.id },
      include:[
      {
        model: DeliverySchedule,
      as: "deliverySchedule"
      }
      ]
    });
    
  }catch(error){
    throw error;
  }
}


export const deliverySchedulePaginatedList = async (
  sellerId,
  page = 1,
  limit = 10,
  search = ""
) => {
  try {
    const offset = (page - 1) * limit;

    const dispatches = await Dispatch.findAndCountAll({
      offset,
      limit,
      include: [
        {
          model: Quote,
          as: "quote",
          where: { supplierId: sellerId },
          include: [
            {
              model: RFQ,
              as: "rfq",
              where: {
                title: {
                  [Op.iLike]: `%${search}%`,
                },
              },
              required: true,
            },
          ],
        },
        {
          model: DeliveryScheduleQuote,
          as: "deliveryScheduleQuote",
          include: [
            {
              model: DeliverySchedule,
              as: "deliverySchedule",
              attributes: ["deliveryLocation"], // 👈 Fetch only what's needed
            },
          ],
        },
      ],
    });

    // Add deliveryLocation to each dispatch record
    const enrichedData = dispatches.rows.map((dispatch) => {
      //@ts-ignore
      const location = dispatch.deliveryScheduleQuote?.deliverySchedule?.deliveryLocation || null;

      return {
        ...dispatch.toJSON(),
        deliveryLocation: location,
      };
    });

    return {
      data: enrichedData,
      pagination: {
        total: dispatches.count,
        page,
        limit,
        totalPages: Math.ceil(dispatches.count / limit),
      },
    };
  } catch (error) {
    throw error;
  }
};


export const getBuyerDispatches = async (buyerId: number, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Dispatch.findAndCountAll({
    offset,
    limit,
    order: [['createdAt', 'DESC']],
    include: [
      {
        model: Quote,
        as: "quote",
        required: true,
        include: [
          {
            model: RFQ,
            as: "rfq",
            where: { buyerId },
            required: true,
          },
        ],
      },
      {
        model: DeliveryScheduleQuote,
        as: "deliveryScheduleQuote",
        include: [
          {
            model: DeliverySchedule,
            as: "deliverySchedule",
          },
        ],
      },
    ],
  });

  return {
    dispatches: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};


