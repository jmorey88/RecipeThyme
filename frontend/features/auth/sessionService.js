export const postSignUp = async (userData) => {
  const response = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    console.log("from auth service userData:", userData);
    throw new Error("Error signing up");
  }

  const data = await response.json();
  return data;
};

export const postLogin = async (userCredentials) => {
  const response = await fetch("http://localhost:3000/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        username: userCredentials.username,
        password: userCredentials.password,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error logging in");
  }

  const data = await response.json();
  return data;
};

export const deleteSession = async () => {
  const response = await fetch("http://localhost:3000/api/logout", {
    method: "DELETE",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Error loggin out");
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
