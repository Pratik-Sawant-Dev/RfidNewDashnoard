import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth } from '../store/slices/authSlice';

const AuthInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Get auth data from localStorage
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && userData && tokenExpiry) {
      try {
        const user = JSON.parse(userData);
        
        // Initialize auth state from localStorage
        dispatch(initializeAuth({
          token,
          user,
          expiresAt: tokenExpiry
        }));
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
        // Clear invalid data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('tokenExpiry');
      }
    }
  }, [dispatch]);

  // This component doesn't render anything
  return null;
};

export default AuthInitializer;
