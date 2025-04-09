import Notification from "../database/models/notification";
import Subscriber from "../database/models/subscriber";
import { sendPushNotification } from "../utlis/notifications";

export const createSubscriber = async (data) => {
  return await Subscriber.create(data);
};

export const getSubscribersByUser = async (userId: number) => {
  return await Subscriber.findAll({ where: { userId } });
};

export const notifyUser = async (userId, title, message, type = "general") => {
    await Notification.create({
      userId,
      title,
      message,
      type,
      read: false,
    });
  
    const subscriber = await Subscriber.findOne({ where: { userId } });
  
    if (subscriber?.deviceToken && subscriber?.externalUserId) {
      await sendPushNotification({
        playerId: subscriber.deviceToken,
        title,
        message,
      });
    }
  };