import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface CustomerState {
  list: any[];
  selected: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: 'customers',
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<any[]>) => {
      state.list = action.payload;
      state.loading = false;
    },
    setSelectedCustomer: (state, action: PayloadAction<any>) => {
      state.selected = action.payload;
    },
    addCustomer: (state, action: PayloadAction<any>) => {
      state.list.unshift(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<any>) => {
      const idx = state.list.findIndex(c => c._id === action.payload._id);
      if (idx >= 0) state.list[idx] = action.payload;
    },
    setCustomerLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setCustomerError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearCustomers: (state) => {
      state.list = [];
      state.selected = null;
    },
  },
});

export const {setCustomers, setSelectedCustomer, addCustomer, updateCustomer, setCustomerLoading, setCustomerError, clearCustomers} = customerSlice.actions;
export default customerSlice.reducer;
