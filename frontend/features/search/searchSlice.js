import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as recipeService from "./searchService.js";
import { setRecipes } from "../recipes/recipeSlice";
import { RESET_STORE } from "../../utils/store_util.jsx";

export const searchRecipes = createAsyncThunk(
  "search/searchRecipes",
  async (searchParams, thunkAPI) => {
    try {
      const { dispatch, getState, requestId } = thunkAPI;
      const { currentRequestId, loading } = getState().search;
      if (loading !== "pending" || requestId !== currentRequestId) {
        return;
      }

      const response = await recipeService.fetchRecipes(searchParams);
      const recipes = response.recipes;
      const metaData = response.meta;

      if (recipes) {
        dispatch(setRecipes(recipes));
        return { ids: recipes.map((recipe) => recipe.id), metaData };
      }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  results: [],
  loading: "idle",
  currentRequestId: undefined,
  error: null,
  metaData: {},
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    resetSearch: (state) => {
      state.results = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchRecipes.pending, (state, action) => {
        if (state.loading === "idle") {
          state.loading = "pending";
          state.currentRequestId = action.meta.requestId;
        }
      })
      .addCase(searchRecipes.fulfilled, (state, action) => {
        if (!action.payload) {
          return;
        }
        const { ids, metaData } = action.payload;
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "idle";
          state.results = [...new Set([...state.results, ...ids])];
          state.currentRequestId = undefined;
          state.metaData = metaData;
        }
      })
      .addCase(searchRecipes.rejected, (state, action) => {
        const { requestId } = action.meta;
        if (
          state.loading === "pending" &&
          state.currentRequestId === requestId
        ) {
          state.loading = "idle";
          state.error = action.error;
          state.currentRequestId = undefined;
        }
      })
      .addCase(RESET_STORE, () => initialState);
  },
});

export const { clearResults, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
