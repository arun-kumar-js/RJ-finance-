import API from './api';

export const getCustomers = async (params?: any) => {
  const res = await API.get('/customers', { params });
  return res.data;
};

export const getCustomer = async (id: string) => {
  const res = await API.get(`/customers/${id}`);
  return res.data;
};

export const createCustomer = async (data: any) => {
  const res = await API.post('/customers', data);
  return res.data;
};

export const updateCustomer = async (id: string, data: any) => {
  const res = await API.put(`/customers/${id}`, data);
  return res.data;
};

export const getTodaysDue = async () => {
  const res = await API.get('/customers/today-due');
  return res.data;
};

export const getOverdue = async () => {
  const res = await API.get('/customers/overdue');
  return res.data;
};
