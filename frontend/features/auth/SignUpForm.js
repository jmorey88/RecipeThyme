import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "./sessionSlice";
import styles from "./SessionsForm.module.css";

const SignUpForm = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.session.currentUser);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(signUp(userData));
  };

  return (
    <div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <div>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={userData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={userData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={userData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={userData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            name="password_confirmation"
            placeholder="Password Confirmation"
            value={userData.password_confirmation}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.sessionButton}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUpForm;
