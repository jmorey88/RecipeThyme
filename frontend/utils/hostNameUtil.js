const API_BASE_URL = console.log("process.env.NODE_ENV", process.env.NODE_ENV);
process.env.NODE_ENV === "production"
  ? "https://secure-fortress-86280-1b73326dc9fb.herokuapp.com/api"
  : "http://localhost:3000/api";

export default API_BASE_URL;
