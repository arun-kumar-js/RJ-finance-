import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const collectionSlice = createSlice({
  name: 'collections',
  initialState: { list: [] as any[], todayStats: null as any, loading: false, error: null as string | null },
  reducers: {
    setCollections: (s, a: PayloadAction<any[]>) => { s.list = a.payload; s.loading = false; },
    setTodayStats: (s, a: PayloadAction<any>) => { s.todayStats = a.payload; },
    addCollection: (s, a: PayloadAction<any>) => { s.list.unshift(a.payload); },
    setCollectionLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload; },
    setCollectionError: (s, a: PayloadAction<string>) => { s.error = a.payload; s.loading = false; },
    clearCollections: (s) => { s.list = []; s.todayStats = null; },
  },
});

export const {setCollections, setTodayStats, addCollection, setCollectionLoading, setCollectionError, clearCollections} = collectionSlice.actions;
export default collectionSlice.reducer;
