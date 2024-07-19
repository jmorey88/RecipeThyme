import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authReducer from "../features/sessions/sessionSlice";
import recipeReducer from "../features/recipes/recipeSlice";
import searchReducer from "../features/search/searchSlice";
import tagReducer from "../features/Tags/TagSlice";

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
    tags: tagReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(middleware),
});
