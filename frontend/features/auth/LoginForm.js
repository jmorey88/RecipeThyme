import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./sessionSlice";
import styles from "./SessionsForm.module.css";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.session.currentUser);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const actionResult = await dispatch(login(credentials));
    if (actionResult.type.endsWith("rejected")) {
      alert(actionResult.payload || "Invalid credentials.  Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.sessionForm}>
      <h2>Login</h2>
      <div>
        <input
          type="username"
          name="username"
          placeholder="Username"
          value={credentials.username}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" className={styles.sessionButton}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
