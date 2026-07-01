const isLocal =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

// Automatically use local backend during local development,
// and fall back to the production Render server when deployed on Netlify/production
const API_URL =
  process.env.REACT_APP_API_URL ||
  (isLocal
    ? "http://localhost:5000/api"
    : "https://crmproject-1.onrender.com/api");

export default API_URL;