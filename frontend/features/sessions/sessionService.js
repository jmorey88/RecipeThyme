import API_BASE_URL from "../../utils/hostNameUtil";
import { fetchWithCsrf } from "../../utils/csrfUtil";

export const postSignUp = async (userData) => {
  const response = await fetchWithCsrf(`${API_BASE_URL}/users`, {
    method: "POST",
    body: JSON.stringify({
      user: {
        first_name: userData.firstName,
        last_name: userData.lastName,
        username: userData.username,
        email: userData.email,
        password: userData.password,
        password_confirmation: userData.password_confirmation,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Error signing up");
  }

  const data = await response.json();
  return data;
};

export const postLogin = async (userCredentials) => {
  const response = await fetchWithCsrf(`${API_BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({
      user: {
        username: userCredentials.username,
        password: userCredentials.password,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.errors || "Error logging in");
  }

  const data = await response.json();
  return data;
};

export const deleteSession = async () => {
  const response = await fetchWithCsrf(`${API_BASE_URL}/logout`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error logging out");
  }

  const data = await response.json();
  return data;
};

export const authService = {
  postSignUp,
  postLogin,
  deleteSession,
};

export default authService;
