import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RESET_STORE } from "../../utils/store_util.jsx";
import {
  fetchRecipeDetails,
  postNewRecipe,
  uploadRecipeImage,
} from "./RecipeService.js";

export const recieveRecipeDetails = createAsyncThunk(
  "recipes/receiveDetail",
  async (recipeId, { dispatch, getState }) => {
    const response = await fetchRecipeDetails(recipeId);
    dispatch(updateRecipeDetail(response));
    return response;
  }
);

export const createRecipe = createAsyncThunk(
  "recipes/createNew",
  async (recipeDetails) => {
    const response = await postNewRecipe(recipeDetails);
    if (!response.ok) {
      Error("error creating recipe");
    }
    return response;
  }
);

export const handleRecipeImage = createAsyncThunk(
  "recipes/uploadImage",
  async ({ recipeId, imageFile }, { rejectWithValue }) => {
    try {
      const result = await uploadRecipeImage(recipeId, imageFile);
      return result;
      // } catch (error) {
      //   console.log("result", result);
      //   return rejectWithValue(result);
    } catch (error) {
      console.log("error:", error);
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  recipeEntities: {},
  currentId: null,
};

export const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipes: (state, action) => {
      const newRecipes = action.payload;
      newRecipes.forEach((newRecipe) => {
        const existingRecipe = state.recipeEntities[newRecipe.id];
        if (!existingRecipe || !existingRecipe.detailed) {
          state.recipeEntities[newRecipe.id] = newRecipe;
        }
      });
    },
    updateRecipeDetail: (state, action) => {
      const detailedRecipe = action.payload;
      // if (state.recipeEntities[detailedRecipe.id]) {
      state.recipeEntities[detailedRecipe.id] = {
        ...state.recipeEntities[detailedRecipe.id],
        ...detailedRecipe,
        detailed: true,
      };
      state.currentId = detailedRecipe.id;
      // }
      // state.recipeEntities.push([detailedRecipe]);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(RESET_STORE, () => {
      initialState;
    });
  },
});

export const { setRecipes, updateRecipeDetail } = recipeSlice.actions;
export default recipeSlice.reducer;
