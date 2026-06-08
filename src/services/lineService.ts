import API from './api';

export const getLines = async () => {
  const res = await API.get('/lines');
  return res.data;
};

export const getLine = async (id: string) => {
  const res = await API.get(`/lines/${id}`);
  return res.data;
};

export const getLineCustomers = async (id: string) => {
  const res = await API.get(`/lines/${id}/customers`);
  return res.data;
};

export const createLine = async (data: any) => {
  const res = await API.post('/lines', data);
  return res.data;
};

export const deleteLine = async (id: string) => {
  const res = await API.delete(`/lines/${id}`);
  return res.data;
};

export const assignCollector = async (lineId: string, collectorId: string) => {
  const res = await API.post(`/lines/${lineId}/assign-collector`, { collectorId });
  return res.data;
};
