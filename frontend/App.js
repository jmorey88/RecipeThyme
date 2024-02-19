import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./features/home/HomePage";
import SignUpForm from "./features/auth/SignUpForm";
import LoginForm from "./features/auth/LoginForm";
import RecipeGallery from "./features/recipeGallery/RecipeGalery";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/recipe-gallery" element={<RecipeGallery />} />
      </Routes>
    </Router>
  );
}

export default App;
