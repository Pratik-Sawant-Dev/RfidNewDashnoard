import React, { createContext, useContext, useState, useEffect } from 'react';
import GlobalLoader from '../components/ui/GlobalLoader';
import globalLoadingManager from '../utils/globalLoadingManager';

const LoadingContext = createContext();

export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};

export const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState({
    loading: false,
    message: 'Loading...',
  });

  useEffect(() => {
    // Subscribe to global loading manager
    const unsubscribe = globalLoadingManager.subscribe((state) => {
      setLoadingState(state);
    });

    // Get initial state
    setLoadingState(globalLoadingManager.getState());

    return unsubscribe;
  }, []);

  const showLoading = (message = 'Loading...') => {
    globalLoadingManager.show(message);
  };

  const hideLoading = () => {
    globalLoadingManager.hide();
  };

  const value = {
    loading: loadingState.loading,
    loadingMessage: loadingState.message,
    showLoading,
    hideLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
      {loadingState.loading && <GlobalLoader message={loadingState.message} />}
    </LoadingContext.Provider>
  );
};
