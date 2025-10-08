import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  selectIsAuthenticated, 
  selectIsLoading, 
  selectToken, 
  selectUser, 
  selectUserInfo,
  selectAuthError,
  selectExpiresAt,
  selectIsAdminFromToken,
  selectTokenClaims,
  selectIsTokenValid,
  logoutStart,
  logoutSuccess,
  logoutFailure,
  clearError,
  checkTokenValidity,
  updateUser
} from '../store/slices/authSlice';
import { clearPermissions } from '../store/slices/permissionSlice';
import apiService from '../services/apiService';

export const useAuth = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isLoading = useSelector(selectIsLoading);
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);
  const userInfo = useSelector(selectUserInfo);
  const error = useSelector(selectAuthError);
  const expiresAt = useSelector(selectExpiresAt);
  
  // Token-based selectors
  const isAdminFromTokenValue = useSelector(selectIsAdminFromToken);
  const tokenClaims = useSelector(selectTokenClaims);
  const isTokenValid = useSelector(selectIsTokenValid);

  // Actions
  const logoutUser = async () => {
    try {
      // Start logout process
      dispatch(logoutStart());
      
      // Call logout API endpoint
      await apiService.logout();
      
      // Clear localStorage
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('tokenExpiry');
      
      // Clear permissions
      dispatch(clearPermissions());
      
      // Dispatch logout success
      dispatch(logoutSuccess());
    } catch (error) {
      console.error('Logout API call failed:', error);
      
      // Even if API fails, clear local data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      localStorage.removeItem('tokenExpiry');
      
      // Clear permissions
      dispatch(clearPermissions());
      
      // Dispatch logout failure (still clears state)
      dispatch(logoutFailure(error.response?.data?.message || 'Logout failed'));
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  const validateToken = () => {
    dispatch(checkTokenValidity());
  };

  const updateUserInfo = (userData) => {
    dispatch(updateUser(userData));
  };

  // Check if user is admin - USING TOKEN instead of user object
  // This is more secure as it verifies the actual JWT token
  const isAdmin = isAdminFromTokenValue;
  
  // Fallback: if token-based check fails, check user object (backward compatibility)
  // But token-based check takes priority
  const isAdminLegacy = user?.isAdmin || false;
  
  // Check if user is active
  const isActive = user?.isActive || false;
  
  // Get user's organization info
  const organizationInfo = {
    name: user?.organisationName,
    clientCode: user?.clientCode,
    databaseName: user?.databaseName,
    showroomType: user?.showroomType
  };

  return {
    // State
    isAuthenticated,
    isLoading,
    token,
    user,
    userInfo,
    error,
    expiresAt,
    isAdmin, // Token-based admin check (primary)
    isAdminLegacy, // Fallback from user object
    isActive,
    organizationInfo,
    
    // Token info
    tokenClaims,
    isTokenValid,
    
    // Actions
    logout: logoutUser,
    clearError: clearAuthError,
    validateToken,
    updateUser: updateUserInfo,
  };
};

export default useAuth;
