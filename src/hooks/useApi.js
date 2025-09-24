import { useSelector, useDispatch } from 'react-redux';
import { 
  selectBaseUrl, 
  selectApiConfig,
  setBaseUrl,
  setTimeout,
  setRetryAttempts,
  setOnlineStatus,
  resetApiConfig
} from '../store/slices/apiSlice';

// Custom hook to use API configuration
export const useApiConfig = () => {
  const dispatch = useDispatch();
  const baseUrl = useSelector(selectBaseUrl);
  const apiConfig = useSelector(selectApiConfig);

  // Action dispatchers
  const updateBaseUrl = (url) => dispatch(setBaseUrl(url));
  const updateTimeout = (timeout) => dispatch(setTimeout(timeout));
  const updateRetryAttempts = (attempts) => dispatch(setRetryAttempts(attempts));
  const updateOnlineStatus = (status) => dispatch(setOnlineStatus(status));
  const resetConfig = () => dispatch(resetApiConfig());

  // Helper function to build full URL with endpoint
  const buildUrl = (endpoint) => {
    return `${baseUrl}${endpoint}`;
  };

  // Helper function to build API request config
  const getRequestConfig = (options = {}) => ({
    baseURL: baseUrl,
    timeout: apiConfig.timeout,
    ...options,
  });

  return {
    // State values
    baseUrl,
    apiConfig,
    
    // Action dispatchers
    updateBaseUrl,
    updateTimeout,
    updateRetryAttempts,
    updateOnlineStatus,
    resetConfig,
    
    // Helper functions
    buildUrl,
    getRequestConfig,
  };
};

// Custom hook specifically for building endpoint URLs
export const useEndpoint = (endpoint) => {
  const baseUrl = useSelector(selectBaseUrl);
  
  const getUrl = () => {
    return `${baseUrl}${endpoint}`;
  };
  
  return getUrl();
};

// Custom hook for API status
export const useApiStatus = () => {
  const dispatch = useDispatch();
  const isOnline = useSelector(state => state.api.isOnline);
  const timeout = useSelector(state => state.api.timeout);
  const retryAttempts = useSelector(state => state.api.retryAttempts);
  
  const setOnline = (status) => dispatch(setOnlineStatus(status));
  
  return {
    isOnline,
    timeout,
    retryAttempts,
    setOnline,
  };
};