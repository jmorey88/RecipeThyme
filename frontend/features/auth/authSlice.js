import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "./authService";

const initialState = {
  currentUser: null,
  // signup: {
  //   isError: false,
  //   isSuccess: false,
  //   isLoading: false,
  // },
  // login: {
  //   isError: false,
  //   isSuccess: false,
  //   isLoading: false,
  // },
  // logout: {
  //   isError: false,
  //   isSuccess: false,
  //   isLoading: false,
  // },
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    //   logout: (state) => {
    //     state.currentUser = null;
    //     Perform any additional logout operations here
    //   },
    // reset: (state) => {
    //   state.signup.isLoading = false;
    //   state.signup.isError = false;
    //   state.signup.isSuccess = false;
    //   state.login.isLoading = false;
    //   state.login.isError = false;
    //   state.login.isSuccess = false;
    //   state.logout.isLoading = false;
    //   state.logout.isError = false;
    //   state.logout.isSuccess = false;
    // },
  },
  extraReducers: (builder) => {
    builder
      // .addCase(signUp.pending, (state) => {
      //   state.signup.isLoading = true;
      // })
      .addCase(signUp.fulfilled, (state, action) => {
        // state.signup.isLoading = false;
        // state.signup.isSuccess = true;
        state.currentUser = action.payload;
      })
      .addCase(signUp.rejected, (state) => {
        // state.signup.isLoading = false;
        // state.signup.isError = true;
        state.currentUser = null;
      })
      // .addCase(login.pending, (state) => {
      //   state.login.isLoading = true;
      // })
      .addCase(login.fulfilled, (state, action) => {
        state.currentUser = action.payload;
      })
      .addCase(login.rejected, (state) => {
        // state.login.isLoading = false;
        // state.login.isError = true;
        state.currentUser = null;
      })
      // .addCase(logout.pending, (state) => {
      //   state.logout.isLoading = true;
      //   state.logout.isSuccess = false;
      // })
      .addCase(logout.fulfilled, (state) => {
        // state.logout.isLoading = false;
        // state.logout.isSuccess = true;
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
    }
  }
);

export const logout = createAsyncThunk("session/logout", async () => {
  await authService.deleteSession();
});

// export const { reset } = sessionSlice.actions;
export default sessionSlice.reducer;
