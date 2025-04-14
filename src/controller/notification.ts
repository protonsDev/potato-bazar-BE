import * as subscriberService from "../services/notificationService";

export const createSubscriber = async (req, res) => {
  try {
   const data = req.body

    const subscriber = await subscriberService.createSubscriber(data);
    res.status(201).json({ success: true, data: subscriber });
  } catch (err) {
    console.error("Create subscriber error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMySubscribers = async (req, res) => {
  try {
    const userId = req.user.id;
    const subscribers = await subscriberService.getSubscribersByUser(userId);
    res.status(200).json({ success: true, data: subscribers });
  } catch (err) {
    console.error("Fetch subscribers error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const data = await subscriberService.getUserNotifications(userId, Number(page), Number(limit));

    res.status(200).json({ success: true, ...data });
  } catch (err) {
    console.error("Fetch notifications error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const { notificationId } = req.body;

    await subscriberService.markNotificationAsRead(userId, notificationId);

    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (err) {
    console.error("Mark notification as read error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

