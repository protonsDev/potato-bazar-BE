import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID;
const ONESIGNAL_API_KEY = process.env.ONESIGNAL_API_KEY;

export const sendPushNotification = async ({ playerId, title, message }) => {
  return await axios.post(
    "https://onesignal.com/api/v1/notifications",
    {
      app_id: ONESIGNAL_APP_ID,
      include_player_ids: [playerId],
      headings: { en: title },
      contents: { en: message },
    },
    {
      headers: {
        Authorization: `Basic ${ONESIGNAL_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );
};
