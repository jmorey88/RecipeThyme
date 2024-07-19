import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as tagService from "./tagService";

// Async thunk to fetch tags from the server
export const fetchTags = createAsyncThunk(
  "tags/fetchTags",
  async (_, thunkAPI) => {
    try {
      const response = await tagService.fetchRecipeTags();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const tagSlice = createSlice({
  name: "tags",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default tagSlice.reducer;
