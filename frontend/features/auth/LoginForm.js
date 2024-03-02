import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { login } from "./authSlice";
import styles from "./SessionsForm.module.css";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.session.currentUser);

  // const navigate = useNavigate();

  // const [hasNavigated, setHasNavigated] = useState(false);

  // useEffect(() => {
  //   if (currentUser) {
  //     navigate("/recipe-gallery");
  //   }
  // }, [currentUser, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(credentials));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <div>
        {/* <label>Username</label> */}
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
        {/* <label>Password</label> */}
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
