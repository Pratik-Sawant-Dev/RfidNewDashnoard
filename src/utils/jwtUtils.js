/**
 * JWT Token Utility Functions
 * Handles JWT token decoding and validation
 */

/**
 * Decode JWT token without verification (client-side only)
 * Note: This does NOT verify the signature - verification should happen on the server
 * This is only for reading the payload
 */
export const decodeJWT = (token) => {
  try {
    if (!token) {
      return null;
    }

    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      console.error('Invalid JWT token format');
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];
    
    // Replace URL-safe characters and add padding if needed
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    
    // Decode base64
    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT token:', error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeJWT(token);
    
    if (!decoded || !decoded.exp) {
      return true;
    }

    // exp is in seconds, Date.now() is in milliseconds
    const expirationTime = decoded.exp * 1000;
    const currentTime = Date.now();

    return currentTime >= expirationTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Get token expiration date
 */
export const getTokenExpiration = (token) => {
  try {
    const decoded = decodeJWT(token);
    
    if (!decoded || !decoded.exp) {
      return null;
    }

    return new Date(decoded.exp * 1000);
  } catch (error) {
    console.error('Error getting token expiration:', error);
    return null;
  }
};

/**
 * Extract user role from token
 * Checks common JWT claim names for role information
 */
export const getUserRoleFromToken = (token) => {
  try {
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      return null;
    }

    // Check various possible role claim names (different APIs use different conventions)
    const role = decoded.role 
      || decoded.Role 
      || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role']
      || null;

    return role;
  } catch (error) {
    console.error('Error extracting role from token:', error);
    return null;
  }
};

/**
 * Check if user is admin from token
 */
export const isAdminFromToken = (token) => {
  try {
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      return false;
    }

    // Check various possible admin claim names and formats
    // Check for explicit isAdmin claim
    if (decoded.isAdmin === true || decoded.isAdmin === 'true' || decoded.isAdmin === '1') {
      return true;
    }

    if (decoded.IsAdmin === true || decoded.IsAdmin === 'true' || decoded.IsAdmin === '1') {
      return true;
    }

    // Check role-based admin
    const role = getUserRoleFromToken(token);
    if (role) {
      const roleStr = typeof role === 'string' ? role.toLowerCase() : '';
      if (roleStr === 'admin' || roleStr === 'administrator') {
        return true;
      }
      
      // Check if role is an array containing admin
      if (Array.isArray(role)) {
        return role.some(r => 
          typeof r === 'string' && 
          (r.toLowerCase() === 'admin' || r.toLowerCase() === 'administrator')
        );
      }
    }

    // Check for admin-specific claims
    if (decoded.admin === true || decoded.admin === 'true') {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking admin status from token:', error);
    return false;
  }
};

/**
 * Extract user ID from token
 */
export const getUserIdFromToken = (token) => {
  try {
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      return null;
    }

    // Check various possible user ID claim names
    return decoded.userId 
      || decoded.UserId 
      || decoded.sub 
      || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']
      || decoded.nameid
      || null;
  } catch (error) {
    console.error('Error extracting user ID from token:', error);
    return null;
  }
};

/**
 * Extract username from token
 */
export const getUsernameFromToken = (token) => {
  try {
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      return null;
    }

    // Check various possible username claim names
    return decoded.userName 
      || decoded.username 
      || decoded.name
      || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
      || decoded.unique_name
      || null;
  } catch (error) {
    console.error('Error extracting username from token:', error);
    return null;
  }
};

/**
 * Extract email from token
 */
export const getEmailFromToken = (token) => {
  try {
    const decoded = decodeJWT(token);
    
    if (!decoded) {
      return null;
    }

    // Check various possible email claim names
    return decoded.email 
      || decoded.Email 
      || decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
      || null;
  } catch (error) {
    console.error('Error extracting email from token:', error);
    return null;
  }
};

/**
 * Get all token claims
 */
export const getTokenClaims = (token) => {
  try {
    return decodeJWT(token);
  } catch (error) {
    console.error('Error getting token claims:', error);
    return null;
  }
};

/**
 * Validate token structure (basic validation)
 */
export const isValidTokenStructure = (token) => {
  try {
    if (!token || typeof token !== 'string') {
      return false;
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return false;
    }

    // Try to decode to ensure it's valid base64
    const decoded = decodeJWT(token);
    return decoded !== null;
  } catch (error) {
    return false;
  }
};

export default {
  decodeJWT,
  isTokenExpired,
  getTokenExpiration,
  getUserRoleFromToken,
  isAdminFromToken,
  getUserIdFromToken,
  getUsernameFromToken,
  getEmailFromToken,
  getTokenClaims,
  isValidTokenStructure
};

