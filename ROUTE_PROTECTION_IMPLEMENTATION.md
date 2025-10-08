# Route Protection Implementation

This document describes the comprehensive route protection system implemented in the RFID Frontend application.

## Overview

The application now has a complete authentication and authorization system with three types of route protection:

1. **Public Routes** - Accessible to everyone
2. **Protected Routes** - Require authentication
3. **Admin Routes** - Require authentication AND admin privileges

## Components

### 1. ProtectedRoute Component
**Location:** `src/components/ProtectedRoute.jsx`

Protects routes that require user authentication.

**Features:**
- Checks if user is authenticated using Redux store
- Shows loading spinner while checking auth state
- Redirects to `/login` if not authenticated
- Saves the intended destination for redirect after login
- Renders protected content if authenticated

**Usage:**
```jsx
<Route path="/dashboard" element={
  <ProtectedRoute>
    <DashboardPage />
  </ProtectedRoute>
} />
```

### 2. AdminRoute Component
**Location:** `src/components/AdminRoute.jsx`

Protects routes that require both authentication AND admin privileges.

**Features:**
- Checks authentication status
- Verifies user has admin role (`isAdmin` flag)
- Shows loading spinner while checking auth state
- Redirects to `/login` if not authenticated
- Displays "Access Denied" page if authenticated but not admin
- Provides user info and navigation options on access denied page

**Usage:**
```jsx
<Route path="/member/admin" element={
  <AdminRoute>
    <AdminPage />
  </AdminRoute>
} />
```

### 3. PublicRoute Component
**Location:** `src/components/PublicRoute.jsx`

Handles public routes and prevents authenticated users from accessing login/register pages.

**Features:**
- Optional `restricted` prop for pages like login/register
- Redirects authenticated users to dashboard if they try to access restricted pages
- Shows loading spinner while checking auth state
- Renders public content for unrestricted pages

**Usage:**
```jsx
// Restricted public route (redirects if authenticated)
<Route path="/login" element={
  <PublicRoute restricted={true}>
    <LoginPage />
  </PublicRoute>
} />

// Unrestricted public route
<Route path="/" element={
  <PublicRoute>
    <LandingPage />
  </PublicRoute>
} />
```

## Route Configuration

### Public Routes
These routes are accessible to everyone:
- `/` - Landing page
- `/login` - Login page (restricted - redirects if authenticated)
- `/onboarding` - Onboarding page (restricted - redirects if authenticated)
- `/forgot-password` - Password recovery (restricted - redirects if authenticated)

### Protected Routes
These routes require authentication:
- `/dashboard` - Dashboard
- `/purchase-entry` - Purchase Entry
- `/add-stock` - Add Stock
- `/invoices` - Invoices
- `/member/user` - Add User (User Management)
- `/management/users` - User Management
- `/master/*` - All master data pages (Category, Product, Design, Purity, Branch, Counter, Box)
- `/reports/*` - All report pages (Stock, Sales, Purchase)
- `/inventory/*` - All inventory pages (Stock, Catalog, RFID Tags)
- `/sales/*` - All sales pages (POS, History, Customers)
- `/settings` - Settings
- `/settings/api` - API Settings

### Admin-Only Routes
These routes require authentication AND admin role:
- `/member/admin` - Add Admin (Admin Management)
- `/management/monitoring` - System Monitoring

## Login Flow

### 1. User tries to access protected route
```
User attempts: /dashboard
↓
Not authenticated
↓
ProtectedRoute redirects to: /login?from=/dashboard
```

### 2. User logs in successfully
```
Login successful
↓
LoginPage reads `from` parameter
↓
Redirects to original destination: /dashboard
```

### 3. If no previous destination
```
Login successful
↓
No `from` parameter
↓
Defaults to: /dashboard
```

## Logout Flow

### User clicks logout
```
User clicks "Sign Out"
↓
Call API: POST {{baseUrl}}/api/User/logout
↓
Clear localStorage (authToken, userData, tokenExpiry)
↓
Clear Redux state
↓
Redirect to: /
```

Even if the API call fails, the user is logged out locally for security.

## Authorization Levels

### Regular User
**Can Access:**
- All protected routes
- User management features
- Master data pages
- Reports
- Inventory management
- Sales features

**Cannot Access:**
- Admin creation page
- System monitoring
- Other admin-only features

### Admin User
**Can Access:**
- All regular user features
- Admin creation page
- System monitoring
- All admin-only features

## Security Features

1. **Token-based Authentication**
   - JWT tokens stored in localStorage
   - Token automatically included in API requests
   - Token expiry validation

2. **Route Guards**
   - Client-side route protection
   - Automatic redirect on unauthorized access
   - Loading states to prevent flashing

3. **Graceful Error Handling**
   - Clear error messages
   - User-friendly access denied pages
   - Fallback navigation options

4. **Session Persistence**
   - Auth state persists across page refreshes
   - Token expiry checking on app initialization
   - Automatic logout on token expiration

## Implementation Details

### Redux Integration
The route protection components use the `useAuth` hook which connects to Redux store:

```javascript
const { isAuthenticated, isAdmin, isLoading, user } = useAuth();
```

### Loading States
All route protection components show a loading spinner while checking authentication to prevent:
- Flash of unauthenticated content
- Multiple redirects
- Poor user experience

### Location State
The `ProtectedRoute` component preserves the intended destination:

```javascript
// Save intended location
<Navigate to="/login" state={{ from: location }} replace />

// Redirect after login
navigate(from, { replace: true });
```

## Testing Route Protection

### Test as Unauthenticated User
1. Try accessing `/dashboard` directly
   - Should redirect to `/login`
2. Login successfully
   - Should redirect back to `/dashboard`

### Test as Regular User
1. Login as non-admin user
2. Try accessing `/member/admin`
   - Should show "Access Denied" page
3. Access `/dashboard`
   - Should work normally

### Test as Admin User
1. Login as admin user
2. Access any route
   - All routes should be accessible

### Test Logout
1. Click "Sign Out" in sidebar or right sidebar
2. Verify redirect to landing page
3. Try accessing protected route
   - Should redirect to login

## Best Practices

1. **Always wrap protected content** - Never leave protected routes unwrapped
2. **Use appropriate protection level** - Choose between ProtectedRoute and AdminRoute based on requirements
3. **Handle loading states** - The components handle this, but be aware of the loading prop
4. **Test thoroughly** - Test all permission combinations
5. **Keep permissions in sync** - Ensure sidebar menu items match route protection levels

## Future Enhancements

Potential improvements to the route protection system:

1. **Role-based Access Control (RBAC)**
   - Support for multiple roles beyond admin/user
   - Granular permissions system

2. **Permission-based Routes**
   - Check specific permissions instead of just admin flag
   - More flexible access control

3. **Route Analytics**
   - Track unauthorized access attempts
   - Monitor route usage patterns

4. **Session Management**
   - Automatic token refresh
   - Session timeout warnings
   - Multi-device session management

5. **Audit Logging**
   - Log all route access attempts
   - Track user navigation patterns

## Troubleshooting

### Issue: Infinite redirect loop
**Solution:** Check that `isLoading` is properly set to `false` after auth check completes

### Issue: Flash of unauthenticated content
**Solution:** The loading spinner should prevent this. Ensure `isLoading` is properly managed

### Issue: Not redirecting after login
**Solution:** Check that location state is properly passed and read in LoginPage

### Issue: Access denied for admin user
**Solution:** Verify the `isAdmin` flag is properly set in the user object and Redux store

## Related Files

- `src/hooks/useAuth.js` - Authentication hook
- `src/store/slices/authSlice.js` - Auth Redux slice with logout actions
- `src/components/layout/Sidebar.jsx` - Left sidebar with logout
- `src/components/layout/RightSidebar.jsx` - Right sidebar with logout
- `src/pages/LoginPage.jsx` - Login page with redirect handling
- `src/App.jsx` - Route configuration
- `src/services/apiService.js` - API service with logout endpoint

## Conclusion

The route protection system provides comprehensive security for the application with:
- ✅ Authentication checks on all protected routes
- ✅ Role-based access control for admin features
- ✅ Graceful handling of unauthorized access
- ✅ Seamless redirect flow after login
- ✅ Proper logout with API integration
- ✅ Loading states for better UX
- ✅ Security-first approach with fallbacks

