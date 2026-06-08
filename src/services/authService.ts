import API from './api';

export const login = async (mobile: string, password: string) => {
  const response = await API.post('/auth/login', { mobile, password });
  return response.data;
};

export const register = async (data: any) => {
  const response = await API.post('/auth/register', data);
  return response.data;
};
