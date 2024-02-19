const API_URL = "/api/users";

const fetchUsers = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Could not fetch users");
  }
  return await response.json();
};

export default {
  fetchUsers,
};
