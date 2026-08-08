import { createSlice } from "@reduxjs/toolkit";

// Rehydrate on app boot so a hard refresh / direct URL navigation
// doesn't wipe out an otherwise-valid session. Redux state normally
// lives only in memory, so without this the accessToken is lost on
// every page reload even though the user is still "logged in".
const initialState = {
  accessToken: sessionStorage.getItem("accessToken") || "",
  refreshToken: sessionStorage.getItem("refreshToken") || "",
};
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload || "";
      if (action.payload) {
        sessionStorage.setItem("accessToken", action.payload);
      } else {
        sessionStorage.removeItem("accessToken");
      }
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload || "";
      if (action.payload) {
        sessionStorage.setItem("refreshToken", action.payload);
      } else {
        sessionStorage.removeItem("refreshToken");
      }
    },
    setLogout: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      sessionStorage.removeItem('refreshToken');
      sessionStorage.removeItem('accessToken');
    },
  },
});
export const { setAccessToken, setLogout,setRefreshToken } = authSlice.actions;
export default authSlice.reducer;
