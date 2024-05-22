import React from "react";
import { useNavigate } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "./NavBar.module.css";
import { logout } from "../auth/sessionSlice.js";
import { resetStore } from "../../utils/store_util.jsx";

const NavBar = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
    dispatch(resetStore());
  };
  const location = useLocation();

  const isLoggedIn = useSelector((state) => state.session.currentUser);

  const logoUrl =
    // "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/recipeThymeLogo.png";
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/recipeThymeLogoBlue.png";

  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.logoLink}>
        <img src={logoUrl} alt="Recipethyme Logo" className={styles.logo} />
      </Link>
      <Link to="/" className={styles.titleLink}>
        Recipe<b>Thyme</b>
      </Link>
      {isLoggedIn ? (
        <button onClick={handleLogout} className={styles.navbarButton}>
          Logout
        </button>
      ) : location.pathname === "/login" ? (
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
