# Permission System Implementation

This document describes the simple permission system implemented for the RFID Jewellery app.

## Overview

The permission system checks user permissions from the API endpoint `{{baseUrl}}/api/Admin/users/{{subUserId}}/permissions` and provides easy access control throughout the app.

## How It Works

1. **User logs in** → Authentication successful
2. **Load permissions** → API call to get user permissions
3. **Store in Redux** → Permissions stored in Redux store
4. **Check permissions** → Components check permissions before showing content
5. **Show/hide content** → Based on user permissions

## API Response Format

The API returns an array of permission objects:

```json
[
  {
    "userPermissionId": 7,
    "userId": 2,
    "clientCode": "LS0001",
    "module": "Product",
    "canView": false,
    "canCreate": true,
    "canEdit": false,
    "canDelete": false,
    "canExport": false,
    "canImport": false,
    "createdOn": "2025-09-30T11:01:53.422354",
    "createdBy": 1,
    "userName": "",
    "userEmail": ""
  }
]
```

## Permission Actions

- **view** - Can see the module content
- **create** - Can create new items
- **edit** - Can modify existing items
- **delete** - Can remove items
- **export** - Can export data
- **import** - Can import data

## Files Created

### 1. `src/store/slices/permissionSlice.js`
Redux slice for managing permissions:
- `fetchUserPermissions(userId)` - Load permissions from API
- `clearPermissions()` - Clear permissions on logout
- Selectors for checking permissions

### 2. `src/hooks/usePermissions.js`
Simple hook for checking permissions:
```javascript
const { 
  canView, 
  canCreate, 
  canEdit, 
  canDelete, 
  canExport, 
  canImport,
  hasPermission 
} = usePermissions();
```

### 3. `src/components/PermissionGuard.jsx`
Component that shows/hides content based on permissions:
```jsx
<PermissionGuard module="Product" action="view">
  <ProductList />
</PermissionGuard>
```

### 4. `src/components/PermissionLoader.jsx`
Automatically loads permissions when user is authenticated.

## Usage Examples

### 1. Using PermissionGuard Component

```jsx
import PermissionGuard from '../components/PermissionGuard';

const ProductPage = () => {
  return (
    <div>
      <h1>Products</h1>
      
      {/* Only show if user can view products */}
      <PermissionGuard module="Product" action="view">
        <ProductList />
      </PermissionGuard>

      {/* Only show if user can create products */}
      <PermissionGuard module="Product" action="create">
        <button>Add Product</button>
      </PermissionGuard>
    </div>
  );
};
```

### 2. Using usePermissions Hook

```jsx
import usePermissions from '../hooks/usePermissions';

const ProductManagement = () => {
  const { canView, canCreate, canEdit, canDelete } = usePermissions();

  return (
    <div>
      {canView('Product') && <ProductList />}
      {canCreate('Product') && <button>Add Product</button>}
      {canEdit('Product') && <button>Edit Product</button>}
      {canDelete('Product') && <button>Delete Product</button>}
    </div>
  );
};
```

### 3. Conditional Rendering

```jsx
const InvoicePage = () => {
  const { hasPermission } = usePermissions();

  return (
    <div>
      {hasPermission('Invoice', 'view') ? (
        <InvoiceList />
      ) : (
        <div>You don't have permission to view invoices</div>
      )}
    </div>
  );
};
```

### 4. Navigation Menu

```jsx
const Navigation = () => {
  const { canView } = usePermissions();

  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      {canView('Product') && <a href="/products">Products</a>}
      {canView('RFID') && <a href="/rfid">RFID</a>}
      {canView('Invoice') && <a href="/invoices">Invoices</a>}
    </nav>
  );
};
```

### 5. Button with Permission Check

```jsx
const PermissionButton = ({ module, action, children, onClick }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(module, action)) {
    return null; // Don't show button
  }

  return <button onClick={onClick}>{children}</button>;
};

// Usage:
<PermissionButton module="Product" action="create" onClick={handleCreate}>
  Add Product
</PermissionButton>
```

## Integration

### 1. App.jsx
The `PermissionLoader` component is added to automatically load permissions:

```jsx
<Provider store={store}>
  <ThemeProvider>
    <AuthInitializer />
    <PermissionLoader />  {/* ← Added this */}
    <Router>
      {/* Routes */}
    </Router>
  </ThemeProvider>
</Provider>
```

### 2. useAuth.js
Updated to clear permissions on logout:

```javascript
// Clear permissions on logout
dispatch(clearPermissions());
```

### 3. Redux Store
Added permission reducer to store:

```javascript
reducer: {
  api: apiReducer,
  auth: authReducer,
  permissions: permissionReducer,  // ← Added this
}
```

## Permission Modules

Based on your API response, the system supports these modules:

- **Product** - Product management
- **RFID** - RFID tag management  
- **Invoice** - Invoice management
- **Reports** - Report generation
- **Users** - User management
- **Settings** - System settings

## Access Denied

When a user doesn't have permission, the `PermissionGuard` component shows:

- Shield icon
- "Access Denied" message
- Specific permission required
- "Go Back" and "Go to Dashboard" buttons

## Error Handling

- **API Error**: Shows error message if permissions can't be loaded
- **No Permissions**: Shows "No permissions found" message
- **Loading State**: Shows loading spinner while fetching permissions

## Testing

### 1. Check Permissions in Console

```javascript
// In browser console
const { permissions } = usePermissions();
console.log('User permissions:', permissions);
```

### 2. Test Permission Checks

```javascript
const { hasPermission } = usePermissions();
console.log('Can view products:', hasPermission('Product', 'view'));
console.log('Can create products:', hasPermission('Product', 'create'));
```

### 3. Debug Permission Loading

The `PermissionLoader` component logs when permissions are loaded:

```
Loading permissions for user: 123
```

## Best Practices

1. **Always check permissions** before showing sensitive content
2. **Use PermissionGuard** for simple show/hide logic
3. **Use usePermissions hook** for complex conditional logic
4. **Check permissions early** in component lifecycle
5. **Provide fallback content** when permissions are denied
6. **Test with different user roles** to ensure proper access control

## Troubleshooting

### Issue: Permissions not loading
**Solution**: Check that user is authenticated and has a valid userId

### Issue: Permission checks always return false
**Solution**: Verify API response format matches expected structure

### Issue: Access denied shown when user should have access
**Solution**: Check module name and action match exactly (case-sensitive)

### Issue: Permissions not cleared on logout
**Solution**: Ensure `clearPermissions()` is called in logout flow

## Security Notes

- Permissions are loaded from server on each login
- Permissions are cleared on logout
- Client-side checks are for UX only
- Server should validate permissions on every API request
- Never trust client-side permission checks for security

## Future Enhancements

Potential improvements:

1. **Permission Caching** - Cache permissions for better performance
2. **Real-time Updates** - Update permissions when changed on server
3. **Permission Groups** - Group related permissions together
4. **Audit Logging** - Log permission checks for security
5. **Permission Inheritance** - Support for role-based permission inheritance

## Conclusion

The permission system provides:

- ✅ **Simple API** - Easy to use hooks and components
- ✅ **Automatic Loading** - Permissions loaded on login
- ✅ **Flexible Checks** - Multiple ways to check permissions
- ✅ **User-Friendly** - Clear access denied messages
- ✅ **Secure** - Server-side permission validation
- ✅ **Maintainable** - Clean, simple code structure

The system is ready to use and provides comprehensive access control for your RFID Jewellery app! 🔐
