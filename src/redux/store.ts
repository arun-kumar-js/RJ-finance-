import {configureStore} from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import languageReducer from './slices/languageSlice';
import dashboardReducer from './slices/dashboardSlice';
import customerReducer from './slices/customerSlice';
import loanReducer from './slices/loanSlice';
import collectionReducer from './slices/collectionSlice';
import lineReducer from './slices/lineSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    language: languageReducer,
    dashboard: dashboardReducer,
    customers: customerReducer,
    loans: loanReducer,
    collections: collectionReducer,
    lines: lineReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
