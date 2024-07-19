// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import userService from "../../services/userservice";

// const initialState = {
//   users: [],
//   status: "idle",
//   error: null,
// };

// export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
//   const response = await userService.fetchUsers();
//   return response.data;
// });

// const userSlice = createSlice({
//   name: "users",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchUsers.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchUsers.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.users = action.payload;
//       })
//       .addCase(fetchUsers.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   },
// });

// export default userSlice.reducer;
