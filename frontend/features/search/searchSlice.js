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
      // If a request is already pending and the current request ID does not match the stored request ID,
      // the request is halted to avoid conflicts and redundant requests.
      if (loading !== "pending" || requestId !== currentRequestId) {
        return;
      }

      const response = await recipeService.fetchRecipes(searchParams);
      const recipes = response.recipes;
      const metaData = response.meta;

      if (recipes) {
        // If the current request ID matches the stored request ID, update the state with the fetched results and metadata.
        // Reset the loading state to 'idle' and clear the current request ID.
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
        // @@@ If the request fails, reset the loading state and store the error message for debugging.
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

export const { resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
