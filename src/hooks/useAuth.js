import { useSelector, useDispatch } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectIsLoading, 
  selectToken, 
  selectUser, 
  selectUserInfo,
  selectAuthError,
  selectExpiresAt,
  logout,
  clearError,
  checkTokenValidity,
  updateUser
} from '../store/slices/authSlice';

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

  // Actions
  const logoutUser = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('tokenExpiry');
    
    // Dispatch logout action
    dispatch(logout());
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

  // Check if user is admin
  const isAdmin = user?.isAdmin || false;
  
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
    isAdmin,
    isActive,
    organizationInfo,
    
    // Actions
    logout: logoutUser,
    clearError: clearAuthError,
    validateToken,
    updateUser: updateUserInfo,
  };
};

export default useAuth;
