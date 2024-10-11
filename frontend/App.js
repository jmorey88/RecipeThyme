import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./features/home/index";
import SessionsForm from "./features/sessions/index";
// import RecipeGallery from "./features/recipes/RecipeGallery/index.js";
import NavBar from "./features/navBar/index";
// import RecipeDetail from "./features/recipes/RecipeDetail/index.js";
// import RecipeForm from "./features/recipes/RecipeCreate/index.js";
import { AuthRoute, ProtectedRoute } from "./utils/routes_util.jsx";
// import EditRecipeForm from "./features/recipes/RecipeEdit/index.js";
import LayoutWithFooter from "./features/footer/LayoutWithFooter.js";
import ScrollToTop from "./utils/scrollToTopUtil.js";

const RecipeDetail = lazy(() =>
  import("./features/recipes/RecipeDetail/index.js")
);
const RecipeGallery = lazy(() =>
  import("./features/recipes/RecipeGallery/index.js")
);
const RecipeForm = lazy(() =>
  import("./features/recipes/RecipeCreate/index.js")
);
const EditRecipeForm = lazy(() =>
  import("./features/recipes/RecipeEdit/index.js")
);

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
                <Suspense fallback={<div>Loading...</div>}>
                  <RecipeGallery />
                </Suspense>
              </LayoutWithFooter>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe/:recipeId"
          element={
            <ProtectedRoute>
              <LayoutWithFooter>
                <Suspense fallback={<div>Loading...</div>}>
                  <RecipeDetail />
                </Suspense>
              </LayoutWithFooter>
            </ProtectedRoute>
          }
        />
        <Route
          path="/recipe-create"
          element={
            <LayoutWithFooter>
              <Suspense fallback={<div>Loading...</div>}>
                <RecipeForm />
              </Suspense>
            </LayoutWithFooter>
          }
        />
        <Route
          path="/recipe/:recipeId/edit"
          element={
            <LayoutWithFooter>
              <Suspense fallback={<div>Loading...</div>}>
                <EditRecipeForm />
              </Suspense>
            </LayoutWithFooter>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
