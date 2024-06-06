const API_BASE_URL =
  process.env.NODE_ENV === "production"
    ? "https://secure-fortress-86280-1b73326dc9fb.herokuapp.com/api"
    : "http://localhost:3000/api";

const API_URL = "/api/users";

const fetchUsers = async () => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) {
    throw new Error("Could not fetch users");
  }
  return await response.json();
};

export default {
  fetchUsers,
};
