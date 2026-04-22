import api from './api';

const authService = {
  async register(name, email, password) {
    const { data } = await api.post('/auth/register', { name, email, password });
    return data.data;
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data;
  },

  async refresh() {
    const { data } = await api.post('/auth/refresh');
    return data.data;
  },

  async logout() {
    await api.post('/auth/logout');
  },

  async getMe() {
    const { data } = await api.get('/auth/me');
    return data.data.user;
  },
};

export default authService;
