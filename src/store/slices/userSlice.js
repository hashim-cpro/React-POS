import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: {
    theme: "light", // 'light', 'dark', or 'system'
  },
  profilePictureUrl: "",
};

const userSlice = createSlice({
  name: "userdata",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings,
        ...action.payload,
      };
    },
    updateProfilePictureUrl: (state, action) => {
      state.profilePictureUrl = action.payload;
    },
    resetUserState: (state) => {
      state.settings = { theme: "system" };
      state.profilePictureUrl = "";
    },
  },
});

export const { updateSettings, updateProfilePictureUrl, resetUserState } =
  userSlice.actions;

export default userSlice.reducer;
