import axios from 'axios';
import store from '../store';
import { selectBaseUrl, selectApiConfig } from '../store/slices/apiSlice';
import { selectToken } from '../store/slices/authSlice';

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
      // Try to get token from Redux store first, then localStorage as fallback
      const state = store.getState();
      const reduxToken = selectToken(state);
      const localToken = localStorage.getItem('authToken');
      const token = reduxToken || localToken;
      
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

  // User Management specific methods
  async registerSubUser(userData) {
    return this.post('/api/Admin/register-sub-user', userData);
  }

  async getUsersUnderAdmin() {
    return this.get('/api/Admin/users-under-admin');
  }

  async updateUser(subUserId, userData) {
    return this.put(`/api/Admin/users/${subUserId}`, userData);
  }

  async deleteUser(subUserId) {
    return this.delete(`/api/Admin/users/${subUserId}`);
  }

  // Master Data - Category specific methods
  async getCategories() {
    return this.get('/api/MasterData/categories');
  }

  async getCategoryById(categoryId) {
    return this.get(`/api/MasterData/categories/${categoryId}`);
  }

  async addCategory(categoryData) {
    return this.post('/api/MasterData/categories', categoryData);
  }

  async updateCategory(categoryData) {
    return this.put('/api/MasterData/categories', categoryData);
  }

  async deleteCategory(categoryId) {
    return this.delete(`/api/MasterData/categories/${categoryId}`);
  }

  // Master Data - Product specific methods
  async getProducts() {
    return this.get('/api/MasterData/products');
  }

  async getProductById(productId) {
    return this.get(`/api/MasterData/products/${productId}`);
  }

  async addProduct(productData) {
    return this.post('/api/MasterData/products', productData);
  }

  async updateProduct(productData) {
    return this.put('/api/MasterData/products', productData);
  }

  async deleteProduct(productId) {
    return this.delete(`/api/MasterData/products/${productId}`);
  }

  // Master Data - Design specific methods
  async getDesigns() {
    return this.get('/api/MasterData/designs');
  }

  async getDesignById(designId) {
    return this.get(`/api/MasterData/designs/${designId}`);
  }

  async addDesign(designData) {
    return this.post('/api/MasterData/designs', designData);
  }

  async updateDesign(designData) {
    return this.put('/api/MasterData/designs', designData);
  }

  async deleteDesign(designId) {
    return this.delete(`/api/MasterData/designs/${designId}`);
  }

  // Master Data - Purity specific methods
  async getPurities() {
    return this.get('/api/MasterData/purities');
  }

  async getPurityById(purityId) {
    return this.get(`/api/MasterData/purities/${purityId}`);
  }

  async addPurity(purityData) {
    return this.post('/api/MasterData/purities', purityData);
  }

  async updatePurity(purityData) {
    return this.put('/api/MasterData/purities', purityData);
  }

  async deletePurity(purityId) {
    return this.delete(`/api/MasterData/purities/${purityId}`);
  }

  // Master Data - Box specific methods
  async getBoxes() {
    return this.get('/api/MasterData/boxes');
  }

  async getBoxById(boxId) {
    return this.get(`/api/MasterData/boxes/${boxId}`);
  }

  async addBox(boxData) {
    return this.post('/api/MasterData/boxes', boxData);
  }

  async updateBox(boxData) {
    return this.put('/api/MasterData/boxes', boxData);
  }

  async deleteBox(boxId) {
    return this.delete(`/api/MasterData/boxes/${boxId}`);
  }

  // Master Data - Branch specific methods
  async getBranches() {
    return this.get('/api/MasterData/branches');
  }

  async getBranchById(branchId) {
    return this.get(`/api/MasterData/branches/${branchId}`);
  }

  async addBranch(branchData) {
    return this.post('/api/MasterData/branches', branchData);
  }

  async updateBranch(branchData) {
    return this.put('/api/MasterData/branches', branchData);
  }

  async deleteBranch(branchId) {
    return this.delete(`/api/MasterData/branches/${branchId}`);
  }

  // Master Data - Counter specific methods
  async getCounters() {
    return this.get('/api/MasterData/counters');
  }

  async getCounterById(counterId) {
    return this.get(`/api/MasterData/counters/${counterId}`);
  }

  async addCounter(counterData) {
    return this.post('/api/MasterData/counters', counterData);
  }

  async updateCounter(counterData) {
    return this.put('/api/MasterData/counters', counterData);
  }

  async deleteCounter(counterId) {
    return this.delete(`/api/MasterData/counters/${counterId}`);
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;