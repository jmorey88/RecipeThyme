import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  const whiteLogoUrl =
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/recipeThymeLogoWhite.png";
  const facebookUrl =
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/facebook-256.png";
  const instUrl =
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/instagram-6-256.png";
  const pintUrl =
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/pinterest-256.png";
  const gitUrl =
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/github-mark-white.png";
  const emailImg =
    "https://recipe-thyme-content.s3.us-west-1.amazonaws.com/app-images/email-5-256.png";

  return (
    <footer className={styles.footerContainer}>
      <div className={styles.leftDiv}>
        <div className={styles.logoDiv}>
          <img
            src={whiteLogoUrl}
            alt="recipeThyme Logo"
            className={styles.whiteLogo}
          />
          <p>
            Recipe<b>Thyme</b>
          </p>
        </div>
      </div>
      <div className={styles.middleDiv}>
        <div className={styles.socialContainer}>
          <img
            src={facebookUrl}
            alt="facebook logo"
            className={styles.facebookLogo}
          />
          <img
            src={instUrl}
            alt="instagram logo"
            className={styles.instaLogo}
          />
          <img src={pintUrl} alt="pinterest logo" className={styles.pintLogo} />
          <img src={gitUrl} alt="github logo" className={styles.gitLogo} />
        </div>
        <p className={styles.copyright}>
          &#169; RecipeThyme All rights reserved.
        </p>
      </div>
      <div className={styles.rightHalf}>
        <div className={styles.emailContainer}>
          <img src={emailImg} alt="email image" className={styles.emailImage} />
          <h3>Email</h3>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
