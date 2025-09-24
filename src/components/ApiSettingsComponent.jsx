import React, { useState } from 'react';
import { useApiConfig } from '../hooks/useApi';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { Settings, Save, RotateCcw, Globe, Clock, RefreshCw } from 'lucide-react';

const ApiSettingsComponent = () => {
  const {
    baseUrl,
    endpoints,
    apiConfig,
    updateBaseUrl,
    updateTimeout,
    updateRetryAttempts,
    resetConfig,
    getEndpointUrl
  } = useApiConfig();

  const [newBaseUrl, setNewBaseUrl] = useState(baseUrl);
  const [newTimeout, setNewTimeout] = useState(apiConfig.timeout);
  const [newRetryAttempts, setNewRetryAttempts] = useState(apiConfig.retryAttempts);

  const handleSaveSettings = () => {
    updateBaseUrl(newBaseUrl);
    updateTimeout(newTimeout);
    updateRetryAttempts(newRetryAttempts);
    alert('API settings saved successfully!');
  };

  const handleReset = () => {
    resetConfig();
    setNewBaseUrl('http://localhost:3001/api');
    setNewTimeout(30000);
    setNewRetryAttempts(3);
    alert('API settings reset to defaults!');
  };

  const testEndpoint = async (endpointName) => {
    try {
      const url = getEndpointUrl(endpointName);
      console.log(`Testing endpoint: ${url}`);
      alert(`Testing ${endpointName} endpoint: ${url}`);
    } catch (error) {
      console.error('Endpoint test failed:', error);
      alert('Endpoint test failed!');
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
          <Settings className="w-6 h-6 mr-2" />
          API Configuration
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your API settings and endpoints configuration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* API Settings */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            API Settings
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Base URL
              </label>
              <Input
                value={newBaseUrl}
                onChange={(e) => setNewBaseUrl(e.target.value)}
                placeholder="Enter API base URL"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timeout (ms)
              </label>
              <Input
                type="number"
                value={newTimeout}
                onChange={(e) => setNewTimeout(Number(e.target.value))}
                placeholder="Request timeout in milliseconds"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Retry Attempts
              </label>
              <Input
                type="number"
                value={newRetryAttempts}
                onChange={(e) => setNewRetryAttempts(Number(e.target.value))}
                placeholder="Number of retry attempts"
                className="w-full"
              />
            </div>
            
            <div className="flex space-x-3 pt-4">
              <Button onClick={handleSaveSettings} className="flex items-center">
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </Button>
              <Button variant="secondary" onClick={handleReset} className="flex items-center">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Current Configuration Display */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2" />
            Current Configuration
          </h2>
          
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Base URL:</span>
              <p className="text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 p-2 rounded mt-1">
                {baseUrl}
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeout:</span>
              <p className="text-sm text-gray-900 dark:text-white">{apiConfig.timeout}ms</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Retry Attempts:</span>
              <p className="text-sm text-gray-900 dark:text-white">{apiConfig.retryAttempts}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status:</span>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  apiConfig.isOnline ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
                <span className={`text-sm ${
                  apiConfig.isOnline ? 'text-green-600' : 'text-red-600'
                }`}>
                  {apiConfig.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Endpoints Testing */}
      <Card className="p-6 mt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <RefreshCw className="w-5 h-5 mr-2" />
          Available Endpoints
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(endpoints).map(([name, path]) => (
            <div key={name} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 dark:text-white capitalize mb-2">
                {name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mb-3">
                {getEndpointUrl(name)}
              </p>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => testEndpoint(name)}
                className="w-full"
              >
                Test Endpoint
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default ApiSettingsComponent;