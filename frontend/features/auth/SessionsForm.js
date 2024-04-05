import React from "react";
import { useLocation } from "react-router";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import styles from "./SessionsForm.module.css";

const SessionsForm = () => {
  const location = useLocation();

  const isLogin = location.pathname.includes("/login");

  const imgUrl =
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/signUpFormImg.jpg";

  return (
    <div className={styles.sessionsPage}>
      <div className={styles.imgContainer}>
        <img src={imgUrl} alt="SignUpImg" className={styles.img} />
      </div>
      <div className={styles.sessionsFormContainer}>
        {isLogin ? <LoginForm /> : <SignUpForm />}
      </div>
    </div>
  );
};

export default SessionsForm;
