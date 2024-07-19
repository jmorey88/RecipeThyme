import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./features/home/index";
import SessionsForm from "./features/sessions/index";
import RecipeGallery from "./features/recipes/RecipeGallery/index.js";
import NavBar from "./features/navBar/index";
import RecipeDetail from "./features/recipes/RecipeDetail/index.js";
import RecipeForm from "./features/recipes/RecipeCreate/index.js";
import { AuthRoute, ProtectedRoute } from "./utils/routes_util.jsx";
import EditRecipeForm from "./features/recipes/RecipeEdit/index.js";
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
