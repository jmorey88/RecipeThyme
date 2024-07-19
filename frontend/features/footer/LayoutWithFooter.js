import React from "react";
import Footer from "./index.js";

const LayoutWithFooter = ({ children }) => {
  return (
    <div>
      {children}
      <Footer />
    </div>
  );
};

export default LayoutWithFooter;
