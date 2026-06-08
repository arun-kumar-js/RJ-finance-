import API from './api';

export const createLoan = async (data: any) => {
  const res = await API.post('/loans', data);
  return res.data;
};

export const getLoan = async (id: string) => {
  const res = await API.get(`/loans/${id}`);
  return res.data;
};

export const getCustomerLoans = async (customerId: string) => {
  const res = await API.get(`/loans/customer/${customerId}`);
  return res.data;
};

export const getEmiSchedule = async (loanId: string) => {
  const res = await API.get(`/loans/${loanId}/emi-schedule`);
  return res.data;
};

export const deleteLoan = async (id: string) => {
  const res = await API.delete(`/loans/${id}`);
  return res.data;
};
