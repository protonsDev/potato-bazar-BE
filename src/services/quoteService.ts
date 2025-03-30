import DeliveryScheduleQuote from "../database/models/delivery_schedule_quote";
import Quote from "../database/models/quote";

export const createQuote = async (data) => {
  try {
    const quote = await Quote.create(data);
    return quote;
  } catch (error) {
    throw error;
  }
};

export const createDeliveryScheduleQuotes = async (quoteId: number,
  scheduleQuotes: any) => {
  try {
    const quoteRecords = scheduleQuotes.map((item) => ({
      quoteId,
      deliveryScheduleId: item.deliveryScheduleId,
      pricePerQuintal: item.pricePerQuintal,
    }));

    const created = await DeliveryScheduleQuote.bulkCreate(quoteRecords);
    return created;
  } catch (error) {
    throw error;
  }
};
