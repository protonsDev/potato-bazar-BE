import Notification from "../database/models/notification";
import Subscriber from "../database/models/subscriber";
import { sendPushNotification } from "../utlis/notifications";

export const createSubscriber = async (data) => {
  return await Subscriber.create(data);
};

export const getSubscribersByUser = async (userId: number) => {
  return await Subscriber.findAll({ where: { userId } });
};

export const notifyUser = async (
  userId: number,
  title: string,
  message: string,
  type: string = "general"
): Promise<void> => {
  await Notification.create({
    userId,
    title,
    message,
    type,
    read: false,
  });

  const subscriber = await Subscriber.findOne({ where: { userId } });

  if (subscriber?.externalUserId) {
    await sendPushNotification(subscriber.externalUserId, title, message);
  }
};

export const getUserNotifications = async (userId, page = 1, limit = 10) => {
  const offset = (page - 1) * limit;

  const { count, rows } = await Notification.findAndCountAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  return {
    notifications: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};
