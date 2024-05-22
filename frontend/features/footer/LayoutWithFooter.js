import React from "react";
import Footer from "./Footer";

const LayoutWithFooter = ({ children }) => {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

export default LayoutWithFooter;
