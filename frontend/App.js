import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./features/home/HomePage";
import SessionsForm from "./features/auth/SessionsForm";
import RecipeGallery from "./features/recipes/RecipeGallery.js";
import NavBar from "./features/navBar/NavBar";
import RecipeDetail from "./features/recipes/RecipeDetail.js";
import RecipeForm from "./features/recipes/RecipeCreate.js";
import { AuthRoute, ProtectedRoute } from "./utils/routes_util.jsx";
import EditRecipeForm from "./features/recipes/RecipeEdit.js";

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
        <Route
          path="/recipe/:recipeId"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />
        <Route path="/recipe-create" element={<RecipeForm />} />
        <Route path="/recipe/:recipeId/edit" element={<EditRecipeForm />} />
      </Routes>
    </Router>
  );
}

export default App;
