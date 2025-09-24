// Example usage of Redux Toolkit API configuration across the app

// 1. In any component - Using the custom hook
import { useApiConfig, useEndpoint } from './hooks/useApi';

const InventoryComponent = () => {
  const { baseUrl, getEndpointUrl } = useApiConfig();
  const inventoryUrl = useEndpoint('inventory');
  
  // Now you can use the baseUrl and endpoints anywhere
  console.log('Base URL:', baseUrl);
  console.log('Inventory endpoint:', inventoryUrl);
  
  return <div>Inventory Component</div>;
};

// 2. Using the API service
import apiService from './services/apiService';

const DataFetcher = () => {
  const fetchInventory = async () => {
    try {
      const data = await apiService.getInventory();
      console.log('Inventory data:', data);
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };
  
  const addItem = async (item) => {
    try {
      const result = await apiService.addInventoryItem(item);
      console.log('Item added:', result);
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };
  
  return <div>Data operations</div>;
};

// 3. Updating API configuration
import { useDispatch } from 'react-redux';
import { setBaseUrl, updateEndpoint } from './store/slices/apiSlice';

const ConfigUpdater = () => {
  const dispatch = useDispatch();
  
  const updateApiConfig = () => {
    // Update base URL
    dispatch(setBaseUrl('https://new-api.jewelrfid.com/api'));
    
    // Update specific endpoint
    dispatch(updateEndpoint({ endpoint: 'inventory', url: '/v2/inventory' }));
  };
  
  return <button onClick={updateApiConfig}>Update Config</button>;
};

// 4. Environment-based configuration
// Create a .env file in your project root:
/*
REACT_APP_API_BASE_URL=http://localhost:3001/api
REACT_APP_API_TIMEOUT=30000
REACT_APP_API_RETRY_ATTEMPTS=3
*/

// The Redux store will automatically use these environment variables
// when initializing the API configuration

export { InventoryComponent, DataFetcher, ConfigUpdater };