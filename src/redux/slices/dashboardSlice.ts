import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface DashboardState {
  data: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  data: null,
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setDashboardData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
      state.error = null;
    },
    setDashboardError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearDashboard: (state) => {
      state.data = null;
      state.error = null;
    },
  },
});

export const {setDashboardLoading, setDashboardData, setDashboardError, clearDashboard} = dashboardSlice.actions;
export default dashboardSlice.reducer;
