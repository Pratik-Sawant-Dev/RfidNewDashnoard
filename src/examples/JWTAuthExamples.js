/**
 * JWT Authentication Examples
 * Real-world usage examples for JWT-based authentication
 */

// ============================================
// Example 1: Using Token-Based Admin Check in Component
// ============================================
import useAuth from '../hooks/useAuth';

export const AdminCheckExample = () => {
  const { isAdmin, isAdminLegacy, tokenClaims } = useAuth();

  return (
    <div>
      {/* Primary: Use token-based check */}
      {isAdmin && (
        <button>Admin Only Action</button>
      )}

      {/* Display admin status */}
      <div>
        <p>Admin (from token): {isAdmin ? 'Yes' : 'No'}</p>
        <p>Admin (legacy): {isAdminLegacy ? 'Yes' : 'No'}</p>
        <p>Token claims: {JSON.stringify(tokenClaims)}</p>
      </div>
    </div>
  );
};

// ============================================
// Example 2: Manually Decode and Check Token
// ============================================
import { 
  decodeJWT, 
  isAdminFromToken, 
  isTokenExpired,
  getUserRoleFromToken 
} from '../utils/jwtUtils';

export const ManualTokenCheckExample = () => {
  const checkToken = () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No token found');
      return;
    }

    // Decode token
    const decoded = decodeJWT(token);
    console.log('Decoded token:', decoded);

    // Check admin status
    const isAdmin = isAdminFromToken(token);
    console.log('Is admin:', isAdmin);

    // Check expiration
    const expired = isTokenExpired(token);
    console.log('Token expired:', expired);

    // Get role
    const role = getUserRoleFromToken(token);
    console.log('User role:', role);
  };

  return <button onClick={checkToken}>Check Token</button>;
};

// ============================================
// Example 3: Protected Component with Token Validation
// ============================================
import { useEffect } from 'react';

export const ProtectedComponentExample = () => {
  const { isAdmin, isTokenValid, logout } = useAuth();

  useEffect(() => {
    // Check token validity on mount
    if (!isTokenValid) {
      console.log('Token is invalid or expired');
      logout();
    }
  }, [isTokenValid, logout]);

  if (!isAdmin) {
    return <div>Access denied. Admin only.</div>;
  }

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Administrator!</p>
    </div>
  );
};

// ============================================
// Example 4: Display Token Expiration Warning
// ============================================
import { useState, useEffect } from 'react';
import { getTokenExpiration } from '../utils/jwtUtils';

export const TokenExpirationWarning = () => {
  const { token } = useAuth();
  const [minutesUntilExpiry, setMinutesUntilExpiry] = useState(null);

  useEffect(() => {
    if (!token) return;

    const updateExpiry = () => {
      const expiration = getTokenExpiration(token);
      if (expiration) {
        const now = new Date();
        const diff = expiration - now;
        const minutes = Math.floor(diff / 1000 / 60);
        setMinutesUntilExpiry(minutes);
      }
    };

    updateExpiry();
    const interval = setInterval(updateExpiry, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [token]);

  if (!minutesUntilExpiry || minutesUntilExpiry > 15) {
    return null; // Don't show warning if more than 15 minutes remaining
  }

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 p-4 rounded">
      ⚠️ Your session will expire in {minutesUntilExpiry} minutes
    </div>
  );
};

// ============================================
// Example 5: Conditional Rendering Based on Role
// ============================================
export const RoleBasedUIExample = () => {
  const { isAdmin, tokenClaims } = useAuth();
  const role = tokenClaims?.role;

  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      <a href="/products">Products</a>
      
      {/* Show for all authenticated users */}
      <a href="/profile">Profile</a>
      
      {/* Show only for admins */}
      {isAdmin && (
        <>
          <a href="/admin">Admin Panel</a>
          <a href="/users">User Management</a>
          <a href="/settings">System Settings</a>
        </>
      )}
      
      {/* Show based on specific role */}
      {role === 'Manager' && (
        <a href="/reports">Reports</a>
      )}
    </nav>
  );
};

// ============================================
// Example 6: API Call with Token Validation
// ============================================
export const ApiCallWithTokenValidation = () => {
  const { token, isTokenValid, logout } = useAuth();

  const makeApiCall = async () => {
    // Check token before making API call
    if (!isTokenValid) {
      console.error('Token is invalid or expired');
      logout();
      return;
    }

    try {
      const response = await fetch('/api/data', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401) {
        // Token might be invalid on server
        console.error('Unauthorized - logging out');
        logout();
        return;
      }

      const data = await response.json();
      console.log('Data:', data);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  return <button onClick={makeApiCall}>Fetch Data</button>;
};

// ============================================
// Example 7: Extract Custom Claims from Token
// ============================================
export const CustomClaimsExample = () => {
  const { tokenClaims } = useAuth();

  // Access custom claims from your token
  const organizationId = tokenClaims?.organizationId;
  const permissions = tokenClaims?.permissions || [];
  const clientCode = tokenClaims?.clientCode;

  return (
    <div>
      <p>Organization: {organizationId}</p>
      <p>Client Code: {clientCode}</p>
      <p>Permissions: {permissions.join(', ')}</p>
    </div>
  );
};

// ============================================
// Example 8: Token Refresh Check
// ============================================
export const TokenRefreshCheckExample = () => {
  const { token, isTokenValid } = useAuth();

  useEffect(() => {
    if (!token) return;

    const checkAndRefresh = async () => {
      const expiration = getTokenExpiration(token);
      if (!expiration) return;

      const now = new Date();
      const diff = expiration - now;
      const minutesUntilExpiry = Math.floor(diff / 1000 / 60);

      // If less than 5 minutes until expiry, refresh token
      if (minutesUntilExpiry < 5 && minutesUntilExpiry > 0) {
        console.log('Token expiring soon, should refresh');
        // Call your token refresh API
        // await refreshToken();
      }
    };

    checkAndRefresh();
    const interval = setInterval(checkAndRefresh, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token]);

  return null; // This is a background check component
};

// ============================================
// Example 9: Debug Token in Development
// ============================================
export const DebugTokenExample = () => {
  const { token, tokenClaims, isAdmin, isTokenValid } = useAuth();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: 10, 
      right: 10, 
      background: 'black', 
      color: 'white', 
      padding: 10,
      fontSize: 12,
      maxWidth: 300,
      borderRadius: 5
    }}>
      <strong>Debug Info:</strong>
      <div>Has Token: {token ? 'Yes' : 'No'}</div>
      <div>Is Admin: {isAdmin ? 'Yes' : 'No'}</div>
      <div>Is Valid: {isTokenValid ? 'Yes' : 'No'}</div>
      <div>User ID: {tokenClaims?.userId || 'N/A'}</div>
      <div>Role: {tokenClaims?.role || 'N/A'}</div>
    </div>
  );
};

// ============================================
// Example 10: Permission-Based Button
// ============================================
export const PermissionBasedButton = ({ requiredRole, children, onClick }) => {
  const { isAdmin, tokenClaims } = useAuth();
  const userRole = tokenClaims?.role;

  // Check if user has required role
  const hasPermission = 
    requiredRole === 'Admin' ? isAdmin :
    userRole === requiredRole;

  if (!hasPermission) {
    return null; // Don't render button if no permission
  }

  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
};

// Usage:
// <PermissionBasedButton requiredRole="Admin" onClick={handleDelete}>
//   Delete Item
// </PermissionBasedButton>

