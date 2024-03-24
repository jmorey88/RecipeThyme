import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./features/home/HomePage";
import SessionsForm from "./features/auth/SessionsForm";
import RecipeGallery from "./features/recipes/RecipeGallery.js";
import NavBar from "./features/navBar/NavBar";
import RecipeDetail from "./features/recipes/RecipeDetail.js";
import { AuthRoute, ProtectedRoute } from "./utils/routes_util.jsx";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/signup"
          element={
            <AuthRoute>
              <SessionsForm />
            </AuthRoute>
          }
        />
        <Route
          path="/login"
          element={
            <AuthRoute>
              <SessionsForm />
            </AuthRoute>
          }
        />
        <Route
          path="/recipe-gallery"
          element={
            <ProtectedRoute>
              <RecipeGallery />
            </ProtectedRoute>
          }
        />
        <Route path="/recipe/:recipeId" element={<RecipeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
