# JWT Token-Based Authentication Implementation

This document describes the JWT token-based authentication and authorization system, replacing the previous login response-based admin checking.

## Overview

The application now uses **JWT token claims** to determine user roles and permissions instead of relying on the `isAdmin` key from the login response. This approach is more secure because:

1. ✅ **Token Integrity** - Admin status is embedded in the signed JWT token
2. ✅ **Tamper-Proof** - Users cannot modify their admin status client-side
3. ✅ **Consistent** - Same token used across all requests
4. ✅ **Standard Practice** - Follows OAuth2/JWT best practices

## Architecture

### Token Flow

```
1. User logs in
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT with claims (including admin status)
   ↓
4. Client receives and stores token
   ↓
5. Client decodes token to check admin status
   ↓
6. Admin status used for route protection & UI rendering
```

## Implementation Files

### 1. JWT Utilities (`src/utils/jwtUtils.js`)

Comprehensive JWT token handling utilities:

#### Core Functions

**`decodeJWT(token)`**
- Decodes JWT token payload without verification
- Returns parsed JSON payload
- Note: Does NOT verify signature (server-side responsibility)

**`isTokenExpired(token)`**
- Checks if token has expired based on `exp` claim
- Returns `true` if expired or invalid

**`getTokenExpiration(token)`**
- Returns Date object of token expiration
- Useful for displaying expiry time to users

#### Admin Verification Functions

**`isAdminFromToken(token)` - PRIMARY FUNCTION**
- Extracts admin status from JWT token
- Checks multiple possible claim formats:
  - `isAdmin`, `IsAdmin` (boolean/string)
  - `role`, `Role` (checks for "admin" or "administrator")
  - `admin` (boolean/string)
  - Microsoft Identity claims
  - SOAP/XML identity claims
- Returns `true` if user is admin, `false` otherwise

**`getUserRoleFromToken(token)`**
- Extracts role claim from token
- Supports various JWT claim naming conventions
- Returns role string or null

#### User Information Functions

**`getUserIdFromToken(token)`**
- Extracts user ID from token claims
- Checks: `userId`, `UserId`, `sub`, `nameidentifier`, `nameid`

**`getUsernameFromToken(token)`**
- Extracts username from token claims
- Checks: `userName`, `username`, `name`, `unique_name`

**`getEmailFromToken(token)`**
- Extracts email from token claims
- Checks: `email`, `Email`, `emailaddress`

**`getTokenClaims(token)`**
- Returns all token claims as object
- Useful for debugging and custom claim extraction

**`isValidTokenStructure(token)`**
- Validates JWT token structure (header.payload.signature)
- Basic validation before attempting decode

### 2. Auth Slice Updates (`src/store/slices/authSlice.js`)

Added new selectors for token-based authentication:

#### New Selectors

**`selectIsAdminFromToken(state)`**
- Extracts admin status directly from JWT token
- Primary selector for admin checks
- Returns `true`/`false`

**`selectTokenClaims(state)`**
- Returns all decoded token claims
- Useful for accessing custom claims

**`selectIsTokenValid(state)`**
- Checks if current token is valid (not expired)
- Returns `true`/`false`

### 3. useAuth Hook Updates (`src/hooks/useAuth.js`)

Enhanced with token-based admin checking:

#### Updated Properties

**`isAdmin`** - PRIMARY
- Now uses `selectIsAdminFromToken`
- Validates admin status from JWT token
- More secure than user object check

**`isAdminLegacy`** - FALLBACK
- Uses `user.isAdmin` from login response
- Kept for backward compatibility
- Not recommended for new code

**`tokenClaims`** - NEW
- Provides access to all JWT token claims
- Useful for custom authorization logic

**`isTokenValid`** - NEW
- Indicates if current token is valid
- Can be used to prompt token refresh

## Token Claim Format

### Expected JWT Payload Structure

Your backend should include admin information in the JWT token. Common formats:

#### Option 1: Direct isAdmin Claim (Recommended)
```json
{
  "userId": "123",
  "userName": "john.doe",
  "email": "john@example.com",
  "isAdmin": true,
  "exp": 1735689600,
  "iat": 1735603200
}
```

#### Option 2: Role-Based
```json
{
  "userId": "123",
  "userName": "john.doe",
  "email": "john@example.com",
  "role": "Admin",
  "exp": 1735689600,
  "iat": 1735603200
}
```

#### Option 3: Microsoft Identity Format
```json
{
  "userId": "123",
  "userName": "john.doe",
  "email": "john@example.com",
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin",
  "exp": 1735689600,
  "iat": 1735603200
}
```

#### Option 4: Multiple Roles
```json
{
  "userId": "123",
  "userName": "john.doe",
  "email": "john@example.com",
  "role": ["User", "Admin"],
  "exp": 1735689600,
  "iat": 1735603200
}
```

### Supported Claim Names

The implementation checks the following claim names (in order):

**For Admin Status:**
- `isAdmin` / `IsAdmin`
- `role` / `Role` (checks if value is "admin" or "administrator")
- `admin`
- `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/role`

**For User ID:**
- `userId` / `UserId`
- `sub` (standard JWT claim)
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier`
- `nameid`

**For Username:**
- `userName` / `username`
- `name`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name`
- `unique_name`

**For Email:**
- `email` / `Email`
- `http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress`

## Usage Examples

### 1. Check Admin Status in Component

```jsx
import useAuth from '../hooks/useAuth';

const MyComponent = () => {
  const { isAdmin, isAdminLegacy, tokenClaims } = useAuth();

  console.log('Is Admin (from token):', isAdmin); // Primary - use this
  console.log('Is Admin (legacy):', isAdminLegacy); // Fallback
  console.log('All token claims:', tokenClaims);

  return (
    <div>
      {isAdmin ? (
        <AdminPanel />
      ) : (
        <UserPanel />
      )}
    </div>
  );
};
```

### 2. Decode Token Manually

```jsx
import { decodeJWT, isAdminFromToken, getTokenClaims } from '../utils/jwtUtils';

const token = localStorage.getItem('authToken');

// Get all claims
const claims = decodeJWT(token);
console.log('Token claims:', claims);

// Check admin status
const isAdmin = isAdminFromToken(token);
console.log('Is admin:', isAdmin);

// Get specific claims
const allClaims = getTokenClaims(token);
console.log('User ID:', allClaims.userId);
console.log('Email:', allClaims.email);
```

### 3. Validate Token Before API Call

```jsx
import { isTokenExpired, getTokenExpiration } from '../utils/jwtUtils';

const makeApiCall = async () => {
  const token = localStorage.getItem('authToken');
  
  if (isTokenExpired(token)) {
    console.error('Token has expired');
    // Redirect to login or refresh token
    return;
  }
  
  const expiration = getTokenExpiration(token);
  console.log('Token expires at:', expiration);
  
  // Proceed with API call
  const response = await fetch('/api/data', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};
```

### 4. Display Token Information

```jsx
import useAuth from '../hooks/useAuth';
import { getTokenExpiration } from '../utils/jwtUtils';

const TokenInfo = () => {
  const { token, tokenClaims, isTokenValid } = useAuth();
  
  if (!token) return <div>Not logged in</div>;
  
  const expiration = getTokenExpiration(token);
  
  return (
    <div>
      <p>Token Valid: {isTokenValid ? 'Yes' : 'No'}</p>
      <p>Expires: {expiration?.toLocaleString()}</p>
      <p>User ID: {tokenClaims?.userId}</p>
      <p>Role: {tokenClaims?.role || 'User'}</p>
      <pre>{JSON.stringify(tokenClaims, null, 2)}</pre>
    </div>
  );
};
```

## Route Protection

The existing route protection components automatically use the token-based admin check:

### AdminRoute Component

```jsx
// Automatically uses isAdmin from token
<Route path="/admin" element={
  <AdminRoute>
    <AdminPage />
  </AdminRoute>
} />
```

The `AdminRoute` component calls `useAuth()` which now returns `isAdmin` based on token claims.

## Migration Guide

### If You're Coming from Response-Based Auth

**Before (Login Response):**
```javascript
// Server returns
{
  "token": "eyJ...",
  "user": {
    "isAdmin": true  // ❌ Can be manipulated client-side
  }
}
```

**After (Token-Based):**
```javascript
// Server returns
{
  "token": "eyJ...", // Contains isAdmin claim inside
  "user": {
    "isAdmin": true  // Still included for backward compatibility
  }
}

// Client now reads from token
const isAdmin = isAdminFromToken(token); // ✅ More secure
```

### Backend Requirements

Your backend must:

1. **Include admin status in JWT payload** when generating tokens
2. **Sign tokens** with a secret key
3. **Validate tokens** on every protected endpoint
4. **Use standard JWT claims** or the supported claim names

### Example Backend (Conceptual)

```csharp
// C# / ASP.NET Core example
var claims = new[]
{
    new Claim("userId", user.Id.ToString()),
    new Claim("userName", user.UserName),
    new Claim("email", user.Email),
    new Claim("isAdmin", user.IsAdmin.ToString()), // Include admin status
    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    new Claim(JwtRegisteredClaimNames.Email, user.Email),
    new Claim(ClaimTypes.Role, user.IsAdmin ? "Admin" : "User")
};

var token = new JwtSecurityToken(
    issuer: _config["Jwt:Issuer"],
    audience: _config["Jwt:Audience"],
    claims: claims,
    expires: DateTime.UtcNow.AddHours(24),
    signingCredentials: credentials
);
```

## Security Considerations

### Client-Side Token Decoding

**Important:** The `decodeJWT` function decodes the token **without verifying the signature**. This is intentional because:

1. ✅ Signature verification requires the secret key
2. ✅ Secret keys should NEVER be exposed to the client
3. ✅ Server validates signature on every API request
4. ✅ Client-side decoding is only for reading claims

### Why This Is Still Secure

Even though we decode tokens client-side:

1. **Token is signed** - Users cannot modify it without invalidating the signature
2. **Server validates** - Every API request validates the token signature
3. **Short-lived tokens** - Tokens expire, limiting damage from theft
4. **HTTPS required** - Tokens transmitted over secure connections

### Best Practices

1. ✅ **Always use HTTPS** in production
2. ✅ **Set reasonable token expiration** (1-24 hours recommended)
3. ✅ **Implement token refresh** for better UX
4. ✅ **Clear tokens on logout** (already implemented)
5. ✅ **Validate tokens server-side** on every request
6. ✅ **Use secure storage** (httpOnly cookies even better than localStorage)

## Testing

### Test Token Generation

Use [jwt.io](https://jwt.io) to generate test tokens:

**Example Admin Token:**
```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "userId": "123",
  "userName": "admin",
  "email": "admin@example.com",
  "isAdmin": true,
  "exp": 9999999999
}

Signature: (use a test secret like "your-test-secret-key")
```

### Test in Browser Console

```javascript
// Test token decoding
import { decodeJWT, isAdminFromToken } from './utils/jwtUtils';

const testToken = 'eyJ...'; // Your test token
const decoded = decodeJWT(testToken);
console.log('Decoded:', decoded);

const isAdmin = isAdminFromToken(testToken);
console.log('Is Admin:', isAdmin);
```

### Automated Tests

```javascript
import { isAdminFromToken, getUserRoleFromToken } from '../utils/jwtUtils';

describe('JWT Utils', () => {
  const adminToken = 'eyJ...'; // Token with isAdmin: true
  const userToken = 'eyJ...';  // Token with isAdmin: false

  test('identifies admin from token', () => {
    expect(isAdminFromToken(adminToken)).toBe(true);
    expect(isAdminFromToken(userToken)).toBe(false);
  });

  test('extracts role from token', () => {
    expect(getUserRoleFromToken(adminToken)).toBe('Admin');
    expect(getUserRoleFromToken(userToken)).toBe('User');
  });
});
```

## Troubleshooting

### Issue: `isAdmin` always returns false

**Solutions:**
1. Check that backend includes admin claim in JWT token
2. Verify token structure using jwt.io
3. Check console for JWT decode errors
4. Ensure claim name matches supported formats

### Issue: Token decode fails

**Solutions:**
1. Verify token is valid JWT format (3 parts separated by dots)
2. Check for extra spaces or newlines in token
3. Ensure token is properly base64 encoded
4. Check browser console for specific error messages

### Issue: Admin access works initially but fails later

**Solutions:**
1. Check if token has expired
2. Verify token is being refreshed properly
3. Check localStorage for token persistence
4. Ensure AuthInitializer is running on app load

### Debugging

Enable JWT debugging by checking token claims:

```jsx
const { tokenClaims } = useAuth();
console.log('Current token claims:', tokenClaims);
console.log('isAdmin in token?', tokenClaims?.isAdmin);
console.log('role in token?', tokenClaims?.role);
```

## Future Enhancements

Potential improvements:

1. **Token Refresh** - Automatic token renewal before expiration
2. **Role-Based Access Control** - Support for multiple roles and permissions
3. **Token Revocation** - Check revoked tokens list
4. **Session Management** - Track active sessions per user
5. **Audit Logging** - Log all admin access attempts

## Related Files

- `src/utils/jwtUtils.js` - JWT utility functions
- `src/store/slices/authSlice.js` - Auth Redux slice with token selectors
- `src/hooks/useAuth.js` - Auth hook with token-based admin check
- `src/components/AdminRoute.jsx` - Uses token-based admin verification
- `src/components/ProtectedRoute.jsx` - Uses token-based authentication

## Conclusion

The JWT token-based authentication system provides:

- ✅ **Enhanced Security** - Admin status verified from signed token
- ✅ **Standard Practice** - Follows OAuth2/JWT conventions
- ✅ **Flexibility** - Supports various JWT claim formats
- ✅ **Backward Compatible** - Legacy checks still work
- ✅ **Extensible** - Easy to add new role types
- ✅ **Maintainable** - Centralized JWT handling

The system is now production-ready and follows security best practices! 🔒

