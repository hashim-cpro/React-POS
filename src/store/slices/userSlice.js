import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  settings: {},
  profilePictureUrl: "",
};

const userSlice = createSlice({
  name: "userdata",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.settings = {
        ...state.settings, // Merge existing settings
        ...action.payload, // Apply the new settings
      };
    },
    updateProfilePictureUrl: (state, action) => {
      state.profilePictureUrl = action.payload; // Set the new profile picture URL
    },
    resetUserState: (state) => {
      state.settings = {}; // Reset settings to an empty object
      state.profilePictureUrl = ""; // Reset profilePictureUrl to an empty string
    },
  },
});

export const { updateSettings, updateProfilePictureUrl, resetUserState } =
  userSlice.actions;

export default userSlice.reducer;
