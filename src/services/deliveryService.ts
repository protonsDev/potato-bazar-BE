import DeliverySchedule from "../database/models/delivery_schedule";
import DeliveryScheduleQuote from "../database/models/delivery_schedule_quote";
import Dispatch from "../database/models/dispatchDetail";
import DispatchStatusLog from "../database/models/dispatchStatusLog";
import Quote from "../database/models/quote";

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
export const getQuoteWithFullDetails = async ({ quoteId }) => {
  const quoteData = await Quote.findAll({
    where: { id: quoteId },
    include: [
      {
        model: DeliveryScheduleQuote,
        as: "deliveryScheduleQuotes",
        include: [
          {
            model: DeliverySchedule,
            as: "deliverySchedule",
          },
          {
            model: Dispatch,
            as: "dispatchDetails",
            include: [
              {
                model: DispatchStatusLog,
                as: "statusLogs",
              },
            ],
          },
        ],
      },
    ],
  });

  return quoteData;
};
