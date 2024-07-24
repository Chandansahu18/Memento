import { configureStore } from '@reduxjs/toolkit';
import mediaReducer from './reducer/savedPhotoSlice';
import userSearchReducer from './reducer/userSearchSlice'; 

const rootReducer = {
  media: mediaReducer,
  userSearch: userSearchReducer,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;