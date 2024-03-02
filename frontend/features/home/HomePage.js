import React from "react";
import styles from "./HomePage.module.css";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className={styles.homePageBackground}>
      <div className={styles.home}>
        <h1 className={styles.heading}>
          Get Inspired Get Organized Get Cooking!
        </h1>
        <p className={styles.newMemberTxt}>New Members Sign Up Here</p>
        <Link to="/signup" className={styles.signupButton}>
          Create an Account
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
