import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authReducer from "../features/auth/sessionSlice";
import recipeReducer from "../features/recipes/recipeSlice";
import searchReducer from "../features/search/searchSlice";

const logger = createLogger();
const middleware = [];

if (process.env.NODE_ENV === "development") {
  middleware.push(logger);
}

export const store = configureStore({
  reducer: {
    session: authReducer,
    recipes: recipeReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});
