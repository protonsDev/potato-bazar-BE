import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const ONESIGNAL_APP_ID = process.env.ONE_SIGNAL_APP_ID as string;
const ONESIGNAL_API_KEY = process.env.ONE_SIGNAL_KEY as string;

export const sendPushNotification = async (
  playerId: string,
  title: string,
  message: string
): Promise<void> => {
  const payload = {
    app_id: ONESIGNAL_APP_ID,
    include_player_ids: [playerId],
    headings: { en: title },
    contents: { en: message },
  };

  try {
    console.log("Sending notification with payload:", payload);

    const response = await axios.post(
      "https://onesignal.com/api/v1/notifications",
      payload,
      {
        headers: {
          Authorization: `Basic ${ONESIGNAL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Notification sent! OneSignal response:", response.data);
  } catch (error: any) {
    console.error("Failed to send notification:", error.response?.data || error);
    throw error;
  }
};
