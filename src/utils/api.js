// Simple API utility functions using Redux base URL
import { store } from '../store';

// Get base URL from Redux store
const getBaseUrl = () => {
  const state = store.getState();
  return state.api.baseUrl;
};

// Simple API call function
export const apiCall = async (endpoint, options = {}) => {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };
  
  const response = await fetch(url, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// Specific API functions
export const registerAdmin = async (payload) => {
  return apiCall('/api/User/register', {
    method: 'POST',
    body: JSON.stringify(payload),

  });
};

export const loginUser = async (credentials) => {
  return apiCall('/api/User/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const logoutUser = async () => {
  return apiCall('/api/User/logout', {
    method: 'POST',
  });
};

export const getInventory = async () => {
  return apiCall('/api/Inventory/GetAll');
};

export const addInventoryItem = async (item) => {
  return apiCall('/api/Inventory/Add', {
    method: 'POST',
    body: JSON.stringify(item),
  });
};

export const updateInventoryItem = async (id, item) => {
  return apiCall(`/api/Inventory/Update/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  });
};

export const deleteInventoryItem = async (id) => {
  return apiCall(`/api/Inventory/Delete/${id}`, {
    method: 'DELETE',
  });
};
