import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface LoanState {
  list: any[];
  selected: any | null;
  emiSchedule: any[];
  loading: boolean;
  error: string | null;
}

const initialState: LoanState = {
  list: [],
  selected: null,
  emiSchedule: [],
  loading: false,
  error: null,
};

const loanSlice = createSlice({
  name: 'loans',
  initialState,
  reducers: {
    setLoans: (state, action: PayloadAction<any[]>) => { state.list = action.payload; state.loading = false; },
    setSelectedLoan: (state, action: PayloadAction<any>) => { state.selected = action.payload; },
    setEmiSchedule: (state, action: PayloadAction<any[]>) => { state.emiSchedule = action.payload; },
    addLoan: (state, action: PayloadAction<any>) => { state.list.unshift(action.payload); },
    setLoanLoading: (state, action: PayloadAction<boolean>) => { state.loading = action.payload; },
    setLoanError: (state, action: PayloadAction<string>) => { state.error = action.payload; state.loading = false; },
    clearLoans: (state) => { state.list = []; state.selected = null; state.emiSchedule = []; },
  },
});

export const {setLoans, setSelectedLoan, setEmiSchedule, addLoan, setLoanLoading, setLoanError, clearLoans} = loanSlice.actions;
export default loanSlice.reducer;
