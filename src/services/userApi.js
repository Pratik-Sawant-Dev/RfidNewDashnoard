import axios from 'axios';
import store from '../store';
import { selectBaseUrl } from '../store/slices/apiSlice';
import { selectToken } from '../store/slices/authSlice';

// Simple helper to get base URL and token
const getApiConfig = () => {
  const state = store.getState();
  const baseUrl = selectBaseUrl(state);

  
  const token = selectToken(state) || localStorage.getItem('authToken');
  
  return { baseUrl, token };
};

// Register sub user
export const registerSubUser = async (userData) => {
  const { baseUrl, token } = getApiConfig();

  
  const response = await axios.post(`${baseUrl}/api/Admin/register-sub-user`, userData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Get users under admin
export const getUsersUnderAdmin = async () => {
  const { baseUrl, token } = getApiConfig();
  
  const response = await axios.get(`${baseUrl}/api/Admin/users-under-admin`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Update user
export const updateUser = async (subUserId, userData) => {
  const { baseUrl, token } = getApiConfig();
  
  const response = await axios.put(`${baseUrl}/api/Admin/users/${subUserId}`, userData, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};

// Delete user
export const deleteUser = async (subUserId) => {
  const { baseUrl, token } = getApiConfig();
  
  const response = await axios.delete(`${baseUrl}/api/Admin/users/${subUserId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data;
};
