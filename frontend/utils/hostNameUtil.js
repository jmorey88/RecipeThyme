const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.recipethyme.net/api"
    : "http://localhost:3000/api";

export default API_BASE_URL;
