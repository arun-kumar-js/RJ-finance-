import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'users',
  initialState: { list: [] as any[], collectors: [] as any[], loading: false, error: null as string | null },
  reducers: {
    setUsers: (s, a: PayloadAction<any[]>) => { s.list = a.payload; s.loading = false; },
    setCollectors: (s, a: PayloadAction<any[]>) => { s.collectors = a.payload; },
    addUser: (s, a: PayloadAction<any>) => { s.list.unshift(a.payload); },
    updateUserInList: (s, a: PayloadAction<any>) => { const i = s.list.findIndex(u => u._id === a.payload._id); if (i >= 0) s.list[i] = a.payload; },
    setUserLoading: (s, a: PayloadAction<boolean>) => { s.loading = a.payload; },
    setUserError: (s, a: PayloadAction<string>) => { s.error = a.payload; s.loading = false; },
    clearUsers: (s) => { s.list = []; s.collectors = []; },
  },
});

export const {setUsers, setCollectors, addUser, updateUserInList, setUserLoading, setUserError, clearUsers} = userSlice.actions;
export default userSlice.reducer;
