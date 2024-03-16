import { createSlice } from "@reduxjs/toolkit";
import { RESET_STORE } from "../../utils/store_util.jsx";

const initialState = {
  entities: {},
  currentId: null,
};

export const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes: (state, action) => {
      const recipes = action.payload;
      recipes.forEach((recipe) => {
        state.entities[recipe.id] = recipe;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_STORE, () => initialState);
  },
});

export const { setRecipes } = recipeSlice.actions;
export default recipeSlice.reducer;
