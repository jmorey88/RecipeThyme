import React from "react";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "./NavBar.module.css";
import { logout } from "../auth/authSlice";

const NavBar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };
  const location = useLocation();

  const isLoggedIn = useSelector((state) => state.session.currentUser);

  const logoUrl =
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/recipeThymeLogo.png";

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logoLink}>
        <img src={logoUrl} alt="Recipethyme Logo" className={styles.logo} />
      </Link>
      <Link to="/" className={styles.titleLink}>
        RecipeThyme
      </Link>
      {isLoggedIn ? (
        <button onClick={handleLogout} className={styles.navbarButton}>
          Logout
        </button>
      ) : // <Link to="/" className={styles.sessionLink}>
      //   Logout
      // </Link>
      location.pathname === "/login" ? (
        <Link to="/signup" className={styles.sessionLink}>
          SignUp
        </Link>
      ) : (
        <Link to="/login" className={styles.sessionLink}>
          Login
        </Link>
      )}
    </nav>
  );
};

export default NavBar;
