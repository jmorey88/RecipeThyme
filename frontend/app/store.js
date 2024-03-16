import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import authReducer from "../features/auth/sessionSlice";
import recipeReducer from "../features/recipes/recipeSlice";
import searchReducer from "../features/search/searchSlice";

export const store = configureStore({
  reducer: {
    session: authReducer,
    recipes: recipeReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
