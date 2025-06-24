// src/apiConfig.js
const BASE_URL = 
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:9100"
    : "https://api.dhannobannokirasoi.com";

export default BASE_URL;
