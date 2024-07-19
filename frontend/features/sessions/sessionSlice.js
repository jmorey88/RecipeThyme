import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./sessionService";

const initialState = {
  currentUser: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload.currentUser;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(signUp.rejected, (state) => {
        state.currentUser = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        state.currentUser = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
      });
  },
});

export const signUp = createAsyncThunk(
  "session/signUp",
  async (user, thunkAPI) => {
    try {
      return await authService.postSignUp(user);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const login = createAsyncThunk(
  "session/login",
  async (userCredentials, thunkAPI) => {
    try {
      const data = await authService.postLogin(userCredentials);
      return data;
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk("session/logout", async () => {
  await authService.deleteSession();
});

export const { setUser } = sessionSlice.actions;
export default sessionSlice.reducer;
