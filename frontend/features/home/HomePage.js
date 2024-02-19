import React from "react";
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div>
      <h1>Welcome to RecipeThyme. Please signup or log in.</h1>
      <Link to="/signup" className="btn btn-primary">
        Sign Up
      </Link>
      <Link to="login" className="btn btn-secondary">
        Log In
      </Link>
    </div>
  );
}

export default HomePage;
