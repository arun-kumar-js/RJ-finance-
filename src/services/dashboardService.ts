import API from './api';

export const getDashboard = async () => {
  const res = await API.get('/dashboard');
  return res.data;
};
