require("dotenv").config();
const CONFIG = {
  mongodb_url: process.env.MODE === "dev" ? process.env.MONGODB_URL_DEV : "",
  port: process.env.PORT,
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  refresh_token: process.env.GDRIVE_REFRESH_TOKEN,
};

module.exports = CONFIG;
