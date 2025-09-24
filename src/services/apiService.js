import axios from 'axios';
import store from '../store';
import { selectBaseUrl, selectApiConfig } from '../store/slices/apiSlice';

// Create axios instance
const createAxiosInstance = () => {
  const state = store.getState();
  const config = selectApiConfig(state);
  
  const instance = axios.create({
    baseURL: config.baseUrl,
    timeout: config.timeout,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Handle unauthorized access
        localStorage.removeItem('authToken');
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// API service class
class ApiService {
  constructor() {
    this.axios = createAxiosInstance();
  }

  // Get current base URL from Redux store
  getBaseUrl() {
    const state = store.getState();
    return selectBaseUrl(state);
  }

  // Update axios instance when store changes
  updateConfig() {
    this.axios = createAxiosInstance();
  }

  // Generic API request method
  async request(endpoint, options = {}) {
    try {
      const response = await this.axios({
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Convenience methods for different HTTP methods
  async get(endpoint, params = {}) {
    return this.request(endpoint, { method: 'GET', params });
  }

  async post(endpoint, data = {}) {
    return this.request(endpoint, { method: 'POST', data });
  }

  async put(endpoint, data = {}) {
    return this.request(endpoint, { method: 'PUT', data });
  }

  async patch(endpoint, data = {}) {
    return this.request(endpoint, { method: 'PATCH', data });
  }

  async delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }

  // Authentication specific methods
  async login(credentials) {
    return this.post('/api/Auth/login', credentials);
  }

  async registerAdmin(userData) {
    return this.post('/api/Admin/register-admin', userData);
  }

  async logout() {
    return this.post('/api/User/logout');
  }

  async refreshToken(token) {
    return this.post('/api/Auth/refresh', { token });
  }

  // Inventory specific methods
  async getInventory(params = {}) {
    return this.get('/api/Inventory', params);
  }

  async addInventoryItem(item) {
    return this.post('/api/Inventory', item);
  }

  async updateInventoryItem(id, item) {
    return this.put(`/api/Inventory/${id}`, item);
  }

  async deleteInventoryItem(id) {
    return this.delete(`/api/Inventory/${id}`);
  }

  // Sales specific methods
  async getSales(params = {}) {
    return this.get('/api/Sales', params);
  }

  async createSale(sale) {
    return this.post('/api/Sales', sale);
  }

  // Purchase specific methods
  async getPurchases(params = {}) {
    return this.get('/api/Purchases', params);
  }

  async createPurchase(purchase) {
    return this.post('/api/Purchases', purchase);
  }

  // Reports specific methods
  async getStockReports(params = {}) {
    return this.get('/api/Reports/stock', params);
  }

  async getSalesReports(params = {}) {
    return this.get('/api/Reports/sales', params);
  }

  async getPurchaseReports(params = {}) {
    return this.get('/api/Reports/purchases', params);
  }

  // Customer specific methods
  async getCustomers(params = {}) {
    return this.get('/api/Customers', params);
  }

  async createCustomer(customer) {
    return this.post('/api/Customers', customer);
  }

  // RFID specific methods
  async getRfidTags(params = {}) {
    return this.get('/api/Rfid/tags', params);
  }

  async assignRfidTag(tagData) {
    return this.post('/api/Rfid/assign', tagData);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;