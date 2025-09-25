// Auth Redux Slice Usage Examples
// This file demonstrates how to use the auth state throughout your application

import { useSelector, useDispatch } from 'react-redux';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  clearError,
  updateUser,
  checkTokenValidity,
  initializeAuth
} from '../store/slices/authSlice';
import useAuth from '../hooks/useAuth';

// Example 1: Using the useAuth hook (Recommended approach)
export const ExampleWithHook = () => {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    token, 
    error, 
    isAdmin, 
    organizationInfo,
    logout: logoutUser,
    clearError: clearAuthError,
    updateUser: updateUserInfo
  } = useAuth();

  const handleLogout = () => {
    logoutUser();
  };

  const handleUpdateProfile = (newData) => {
    updateUserInfo(newData);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user?.fullName || user?.userName}!</h1>
      <p>Email: {user?.email}</p>
      <p>Organization: {organizationInfo.name}</p>
      <p>Role: {isAdmin ? 'Administrator' : user?.userType}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

// Example 2: Using Redux selectors directly
export const ExampleWithSelectors = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const user = useSelector(state => state.auth.user);
  const isLoading = useSelector(state => state.auth.isLoading);
  const error = useSelector(state => state.auth.error);

  const handleLogin = async (credentials) => {
    dispatch(loginStart());
    try {
      // Your login API call here
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      const data = await response.json();
      
      if (data.token) {
        dispatch(loginSuccess({
          token: data.token,
          user: data.user,
          expiresAt: data.expiresAt
        }));
      } else {
        dispatch(loginFailure(data.message || 'Login failed'));
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <div>
      {isLoading && <div>Logging in...</div>}
      {error && <div>Error: {error}</div>}
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {user?.fullName}!</h1>
          <button onClick={() => dispatch(logout())}>Logout</button>
        </div>
      ) : (
        <button onClick={() => handleLogin({ email: 'test@example.com', password: 'password' })}>
          Login
        </button>
      )}
    </div>
  );
};

// Example 3: Protected Route Component
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Access denied. Please log in.</div>;
  }

  return children;
};

// Example 4: Admin Only Component
export const AdminOnlyComponent = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <div>Admin access required.</div>;
  }

  return children;
};

// Example 5: Token Validation
export const TokenValidator = () => {
  const { validateToken, expiresAt } = useAuth();

  const checkToken = () => {
    validateToken();
  };

  return (
    <div>
      <p>Token expires: {expiresAt ? new Date(expiresAt).toLocaleString() : 'N/A'}</p>
      <button onClick={checkToken}>Validate Token</button>
    </div>
  );
};

// Example 6: User Profile Update
export const ProfileUpdater = () => {
  const { user, updateUser } = useAuth();

  const handleUpdateProfile = () => {
    const updatedData = {
      fullName: 'Updated Name',
      mobileNumber: '1234567890',
      city: 'Updated City'
    };
    
    updateUser(updatedData);
  };

  return (
    <div>
      <h2>Current Profile</h2>
      <p>Name: {user?.fullName}</p>
      <p>Phone: {user?.mobileNumber}</p>
      <p>City: {user?.city}</p>
      <button onClick={handleUpdateProfile}>Update Profile</button>
    </div>
  );
};

// Example 7: Organization Info Display
export const OrganizationDisplay = () => {
  const { organizationInfo, user } = useAuth();

  return (
    <div>
      <h2>Organization Information</h2>
      <p>Name: {organizationInfo.name}</p>
      <p>Client Code: {organizationInfo.clientCode}</p>
      <p>Database: {organizationInfo.databaseName}</p>
      <p>Showroom Type: {organizationInfo.showroomType}</p>
    </div>
  );
};

// Example 8: Login Form Integration
export const LoginFormExample = () => {
  const dispatch = useDispatch();
  const { isLoading, error, clearError } = useAuth();

  const handleSubmit = async (formData) => {
    dispatch(loginStart());
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.token) {
        dispatch(loginSuccess({
          token: data.token,
          user: data.user,
          expiresAt: data.expiresAt
        }));
        
        // Store in localStorage for persistence
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        localStorage.setItem('tokenExpiry', data.expiresAt);
      } else {
        dispatch(loginFailure(data.message || 'Login failed'));
      }
    } catch (err) {
      dispatch(loginFailure(err.message));
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      handleSubmit({
        email: formData.get('email'),
        password: formData.get('password')
      });
    }}>
      {error && (
        <div className="error">
          {error}
          <button type="button" onClick={clearError}>Clear</button>
        </div>
      )}
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};

export default {
  ExampleWithHook,
  ExampleWithSelectors,
  ProtectedRoute,
  AdminOnlyComponent,
  TokenValidator,
  ProfileUpdater,
  OrganizationDisplay,
  LoginFormExample
};
