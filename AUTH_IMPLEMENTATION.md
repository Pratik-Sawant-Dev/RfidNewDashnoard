# Authentication Redux Implementation

This document describes the complete authentication system implemented using Redux Toolkit for the RFID Jewelry Management application.

## Overview

The authentication system stores all login response data in Redux state, providing centralized access to user information, authentication status, and related functionality throughout the application.

## Files Created/Modified

### 1. Redux Store Files
- `src/store/slices/authSlice.js` - Main authentication slice with actions and reducers
- `src/store/index.js` - Updated to include auth reducer
- `src/hooks/useAuth.js` - Custom hook for easy auth state access

### 2. Components
- `src/components/AuthInitializer.jsx` - Initializes auth state from localStorage
- `src/components/UserInfoDisplay.jsx` - Example component showing user info
- `src/App.jsx` - Updated to include AuthInitializer

### 3. Pages
- `src/pages/LoginPage.jsx` - Updated to use Redux for login data storage
- `src/components/layout/Header.jsx` - Updated to display real user data

### 4. Examples
- `src/examples/AuthUsageExamples.js` - Comprehensive usage examples

## Login API Response Structure

The system handles the following login API response structure:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": 12,
    "userName": "Prasad1",
    "email": "prasad@gmail.com",
    "fullName": "Prasad Panchal",
    "mobileNumber": "8978675645",
    "faxNumber": null,
    "city": "Pune",
    "address": "Wakada Hinjawadi Road",
    "organisationName": "Prasad Jewellers",
    "showroomType": "Luxury",
    "clientCode": "LS0009",
    "databaseName": "RFID_LS0009_Prasad_Jewellers",
    "connectionString": null,
    "isAdmin": false,
    "userType": "User",
    "adminUserId": null,
    "isActive": true,
    "createdOn": "2025-09-24T05:52:08.2281812",
    "lastLoginDate": "2025-09-24T05:53:08.3045267Z"
  },
  "expiresAt": "2025-09-25T05:53:08.5914457Z"
}
```

## Redux State Structure

```javascript
{
  auth: {
    // Authentication status
    isAuthenticated: boolean,
    isLoading: boolean,
    
    // Token information
    token: string | null,
    expiresAt: string | null,
    
    // Complete user information
    user: {
      userId: number | null,
      userName: string | null,
      email: string | null,
      fullName: string | null,
      mobileNumber: string | null,
      faxNumber: string | null,
      city: string | null,
      address: string | null,
      organisationName: string | null,
      showroomType: string | null,
      clientCode: string | null,
      databaseName: string | null,
      connectionString: string | null,
      isAdmin: boolean,
      userType: string | null,
      adminUserId: string | null,
      isActive: boolean,
      createdOn: string | null,
      lastLoginDate: string | null,
    },
    
    // Error handling
    error: string | null,
  }
}
```

## Available Actions

### Auth Slice Actions
- `loginStart()` - Sets loading state to true
- `loginSuccess(payload)` - Stores token, user data, and expiry
- `loginFailure(error)` - Stores error message
- `logout()` - Clears all auth data
- `clearError()` - Removes error message
- `updateUser(userData)` - Updates user information
- `checkTokenValidity()` - Validates token expiry
- `initializeAuth(payload)` - Initializes from localStorage

## Usage Examples

### 1. Using the useAuth Hook (Recommended)

```javascript
import useAuth from '../hooks/useAuth';

const MyComponent = () => {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    isAdmin, 
    organizationInfo,
    logout 
  } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please log in</div>;

  return (
    <div>
      <h1>Welcome, {user?.fullName}!</h1>
      <p>Organization: {organizationInfo.name}</p>
      <p>Role: {isAdmin ? 'Admin' : user?.userType}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

### 2. Login Implementation

```javascript
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/authSlice';

const LoginComponent = () => {
  const dispatch = useDispatch();

  const handleLogin = async (credentials) => {
    dispatch(loginStart());
    
    try {
      const response = await loginUser(credentials);
      
      if (response.token) {
        dispatch(loginSuccess({
          token: response.token,
          user: response.user,
          expiresAt: response.expiresAt
        }));
        
        // Store in localStorage for persistence
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userData', JSON.stringify(response.user));
        localStorage.setItem('tokenExpiry', response.expiresAt);
      }
    } catch (error) {
      dispatch(loginFailure(error.message));
    }
  };
};
```

### 3. Protected Routes

```javascript
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;

  return children;
};
```

### 4. Admin-Only Components

```javascript
import useAuth from '../hooks/useAuth';

const AdminPanel = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return <div>Admin access required</div>;
  }

  return <div>Admin content here</div>;
};
```

## Available Selectors

The auth slice provides several selectors for accessing specific parts of the state:

```javascript
import { 
  selectIsAuthenticated,
  selectIsLoading,
  selectToken,
  selectUser,
  selectUserInfo,
  selectAuthError,
  selectExpiresAt,
  selectAuthState
} from '../store/slices/authSlice';

// Usage
const isAuthenticated = useSelector(selectIsAuthenticated);
const user = useSelector(selectUser);
const token = useSelector(selectToken);
```

## Persistence

The system automatically:
1. Stores auth data in localStorage on successful login
2. Initializes auth state from localStorage on app startup
3. Validates token expiry and clears expired tokens
4. Clears localStorage on logout

## Error Handling

The auth slice includes comprehensive error handling:
- Login failures are stored in the error state
- Errors can be cleared using the `clearError` action
- Network errors and API errors are properly handled

## Token Management

- Automatic token validation on app initialization
- Token expiry checking
- Automatic logout on token expiration
- Secure token storage in localStorage

## Integration Points

### LoginPage.jsx
- Uses Redux actions for login flow
- Stores complete response data in Redux state
- Maintains localStorage for persistence

### Header.jsx
- Displays real user information from Redux state
- Shows organization details
- Implements logout functionality

### AuthInitializer.jsx
- Automatically loads auth state on app startup
- Validates stored tokens
- Clears invalid/expired data

## Best Practices

1. **Use the useAuth hook** for most auth-related operations
2. **Check authentication status** before rendering protected content
3. **Handle loading states** appropriately
4. **Clear errors** when appropriate
5. **Validate tokens** periodically
6. **Use selectors** for specific state access when needed

## Testing

The implementation includes comprehensive error handling and state management that can be easily tested:

```javascript
// Example test
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '../hooks/useAuth';

test('should return user data when authenticated', () => {
  // Mock Redux state
  // Test hook behavior
});
```

## Future Enhancements

Potential improvements for the auth system:
1. Add refresh token functionality
2. Implement role-based permissions
3. Add session timeout warnings
4. Implement multi-factor authentication
5. Add audit logging for auth events

This implementation provides a robust, scalable authentication system that centralizes all login data and provides easy access throughout the application.
