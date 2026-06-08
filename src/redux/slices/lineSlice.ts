import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const lineSlice = createSlice({
  name: 'lines',
  initialState: { list: [] as any[], selected: null as any, loading: false, error: null as string | null },
  reducers: {
    setLines: (s, a: PayloadAction<any[]>) => { s.list = a.payload; s.loading = false; },
    setSelectedLine: (s, a: PayloadAction<any>) => { s.selected = a.payload; },
    addLine: (s, a: PayloadAction<any>) => { s.list.push(a.payload); },
    updateLine: (s, a: PayloadAction<any>) => { const i = s.list.findIndex(l => l._id === a.payload._id); if (i >= 0) s.list[i] = a.payload; },
    setLineLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload; },
    setLineError: (s, a: PayloadAction<string>) => { s.error = a.payload; s.loading = false; },
    clearLines: (s) => { s.list = []; s.selected = null; },
  },
});

export const {setLines, setSelectedLine, addLine, updateLine, setLineLoading, setLineError, clearLines} = lineSlice.actions;
export default lineSlice.reducer;
