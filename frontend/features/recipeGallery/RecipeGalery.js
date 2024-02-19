import React from "react";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { logout } from "../auth/authSlice";

const RecipeGallery = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <h1>Recipe Gallery</h1>
      <h2>welcome user</h2>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default RecipeGallery;
