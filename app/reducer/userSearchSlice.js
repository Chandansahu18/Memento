import { createSlice } from "@reduxjs/toolkit";

const userSearchSlice = createSlice({
  name: "userSearch",
  initialState: {
    searchHistory: [],
    searchResults: [],
  },
  reducers: {
    addToSearchHistory: (state, action) => {
      if (!state.searchHistory.includes(action.payload)) {
        state.searchHistory.unshift(action.payload);
        if (state.searchHistory.length > 5) {
          state.searchHistory.pop();
        }
      }
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchHistory: (state, action) => {
      state.searchHistory = action.payload;
    },
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    setSearchHistory: (state, action) => {
      state.searchHistory = action.payload;
    },
    clearSearchHistoryItem: (state, action) => {
      state.searchHistory = state.searchHistory.filter(
        (item) => item !== action.payload
      );
    },
    clearAllSearchHistory: (state) => {
      state.searchHistory = [];
    },
  },
});

export const {
  addToSearchHistory,
  setSearchResults,
  setSearchHistory,
  clearSearchHistoryItem,
  clearAllSearchHistory,
} = userSearchSlice.actions;
export default userSearchSlice.reducer;
