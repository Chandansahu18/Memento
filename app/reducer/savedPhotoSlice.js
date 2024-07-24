import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const loadSavedMedia = createAsyncThunk(
  'media/loadSavedMedia',
  async () => {
    try {
      const savedMediaString = await AsyncStorage.getItem('savedMedia');
      return savedMediaString ? JSON.parse(savedMediaString) : [];
    } catch (error) {
      console.error('Error loading saved media:', error);
      throw error;
    }
  }
);

export const saveMedia = createAsyncThunk(
  'media/saveMedia',
  async (newMedia, { getState }) => {
    try {
      const state = getState();
      const updatedMedia = [newMedia, ...state.media.savedMedia];
      await AsyncStorage.setItem('savedMedia', JSON.stringify(updatedMedia));
      return updatedMedia;
    } catch (error) {
      console.error('Error saving media:', error);
      throw error;
    }
  }
);

const mediaSlice = createSlice({
  name: 'media',
  initialState: {
    savedMedia: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSavedMedia.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadSavedMedia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedMedia = action.payload;
      })
      .addCase(loadSavedMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveMedia.pending, (state) => {
        state.status = 'saving';
      })
      .addCase(saveMedia.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.savedMedia = action.payload;
      })
      .addCase(saveMedia.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

// Memoized Selectors
const selectMediaState = (state) => state.media;

export const selectSavedMedia = createSelector(
  [selectMediaState],
  (mediaState) => mediaState.savedMedia
);

export const selectMediaStatus = createSelector(
  [selectMediaState],
  (mediaState) => mediaState.status
);

export const selectMediaError = createSelector(
  [selectMediaState],
  (mediaState) => mediaState.error
);

export default mediaSlice.reducer;