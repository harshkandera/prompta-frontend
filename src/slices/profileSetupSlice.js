// itemsSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiConnector } from '../service/apiconnector'

// Define the initial state
const initialState = {
  profile:null,
  status: 'idle',
  error: null,
};

// Define an asynchronous thunk using createAsyncThunk
const fetchprofileData = createAsyncThunk('profileData', async (profileId) => {
  try {
    const response = await apiConnector("GET",process.env.REACT_APP_BASE_URL +`/api/profile/${profileId}`);
    return response.data.profileData; // Assuming the API response contains the data array
  } catch (error) {
    throw error;
  }
});

// Create a slice with reducers and the asynchronous thunk
const profileSetupSlice = createSlice({
  name: 'profileData',
  initialState,
  reducers: {   setProfileData(state,action){
    state.profile = action.payload

        },
    },
  extraReducers: (builder) => {
    builder
      .addCase(fetchprofileData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchprofileData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.profile = action.payload;
      })
      .addCase(fetchprofileData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Export the asynchronous action and the slice reducer
export { fetchprofileData };
export const {setProfileData} = profileSetupSlice.actions;
export default profileSetupSlice.reducer;
