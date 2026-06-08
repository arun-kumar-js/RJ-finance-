import API from './api';

export const createCollection = async (data: any) => {
  const res = await API.post('/collections', data);
  return res.data;
};

export const getCollections = async (params?: any) => {
  const res = await API.get('/collections', { params });
  return res.data;
};

export const getTodaysCollections = async () => {
  const res = await API.get('/collections/today');
  return res.data;
};

export const validateReceipt = async (bookNumber: string, receiptNumber: number) => {
  const res = await API.post('/receipt-books/validate', { bookNumber, receiptNumber });
  return res.data;
};

export const collectPayment = async (collectionId: string) => {
  const res = await API.post(`/finance/collections/${collectionId}/collect`);
  return res.data;
};

export const collectEmi = async (data: any) => {
  const res = await API.post(`/collections`, data);
  return res.data;
};
