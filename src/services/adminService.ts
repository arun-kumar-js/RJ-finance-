import API from './api';

export const getUsers = async (params?: any) => {
  const res = await API.get('/users', { params });
  return res.data;
};

export const getCollectors = async () => {
  const res = await API.get('/users/collectors');
  return res.data;
};

export const createUser = async (data: any) => {
  const res = await API.post('/users', data);
  return res.data;
};

export const deleteUser = async (id: string) => {
  const res = await API.delete(`/users/${id}`);
  return res.data;
};

export const updateUserStatus = async (id: string, status: 'active' | 'inactive') => {
  const res = await API.put(`/users/${id}/status`, { status });
  return res.data;
};

export const getReceiptBooks = async () => {
  const res = await API.get('/receipt-books');
  return res.data;
};

export const issueReceiptBook = async (data: any) => {
  const res = await API.post('/receipt-books', data);
  return res.data;
};

export const getAuditLogs = async (params?: any) => {
  const res = await API.get('/audit-logs', { params });
  return res.data;
};

export const getAnalytics = async (endpoint: string, params?: any) => {
  const res = await API.get(`/analytics/${endpoint}`, { params });
  return res.data;
};

export const getUserStats = async (id: string) => {
  const res = await API.get(`/users/${id}/stats`);
  return res.data;
};
