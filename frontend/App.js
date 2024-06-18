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
import LayoutWithFooter from "./features/footer/LayoutWithFooter.js";
import ScrollToTop from "./utils/scrollToTopUtil.js";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <AuthRoute>
              <HomePage />
            </AuthRoute>
          }
        />
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
              <LayoutWithFooter>
                <RecipeGallery />
              </LayoutWithFooter>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:recipeId"
          element={
            <ProtectedRoute>
              <LayoutWithFooter>
                <RecipeDetail />
              </LayoutWithFooter>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe-create"
          element={
            <LayoutWithFooter>
              <RecipeForm />
            </LayoutWithFooter>
          }
        />
        <Route
          path="/recipe/:recipeId/edit"
          element={
            <LayoutWithFooter>
              <EditRecipeForm />
            </LayoutWithFooter>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
