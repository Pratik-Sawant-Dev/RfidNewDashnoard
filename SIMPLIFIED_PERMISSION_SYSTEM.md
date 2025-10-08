# Simplified Permission System

## Overview

The permission system has been simplified to work directly with the login response. Permissions are now included in the user data returned from the login API, eliminating the need for separate permission API calls.

## Key Changes

### 1. Updated Auth Slice (`src/store/slices/authSlice.js`)

- Added `permissions` array to user state
- Added `branchId`, `branchName`, `counterId`, `counterName` fields
- Added permission-related selectors:
  - `selectUserPermissions` - Get all user permissions
  - `selectModulePermissions(module)` - Get permissions for specific module
  - `selectHasPermission(module, action)` - Check specific permission
  - `selectHasModuleAccess(module)` - Check if user has any access to module

### 2. Simplified Permission Slice (`src/store/slices/permissionSlice.js`)

- Removed async thunk for fetching permissions
- Simplified to work with permissions from auth state
- Kept for backward compatibility but now redirects to auth selectors

### 3. Updated usePermissions Hook (`src/hooks/usePermissions.js`)

- Now works directly with permissions from auth state
- No longer needs to load permissions separately
- Simplified implementation using Redux selectors

### 4. Updated Permission Components

- `PermissionGuard.jsx` - Works with updated usePermissions hook
- `PermissionLoader.jsx` - Simplified, no longer needed
- `SmartPermissionLoader.jsx` - Simplified, no longer needed

### 5. Updated useAuth Hook (`src/hooks/useAuth.js`)

- Removed `loadUserPermissions` function
- Permissions are now automatically available after login

## Login Response Structure

The login API now returns user data with permissions included:

```json
{
  "userId": 2,
  "userName": "user1@jewelrystore.com",
  "email": "user1@jewelrystore.com",
  "fullName": "John User",
  "mobileNumber": "+91-9876543212",
  "city": "Mumbai",
  "address": "789 User Street, Mumbai, Maharashtra, India",
  "organisationName": "Premium Jewelry Store",
  "showroomType": "Premium",
  "clientCode": "LS0001",
  "databaseName": "RFID_LS0001_Premium_Jewelry_Store",
  "isAdmin": false,
  "adminUserId": 1,
  "userType": "User",
  "isActive": true,
  "createdOn": "2025-10-06T13:57:23.8959083Z",
  "lastLoginDate": null,
  "branchId": 1,
  "branchName": "Main Branch",
  "counterId": 1,
  "counterName": "Counter 1",
  "permissions": [
    {
      "userPermissionId": 1,
      "userId": 2,
      "clientCode": "LS0001",
      "module": "Product",
      "canView": true,
      "canCreate": true,
      "canEdit": true,
      "canDelete": false,
      "canExport": true,
      "canImport": false,
      "createdOn": "2025-10-06T13:57:23.9981477Z",
      "createdBy": 1,
      "userName": "",
      "userEmail": ""
    },
    {
      "userPermissionId": 2,
      "userId": 2,
      "clientCode": "LS0001",
      "module": "RFID",
      "canView": true,
      "canCreate": true,
      "canEdit": true,
      "canDelete": false,
      "canExport": true,
      "canImport": false,
      "createdOn": "2025-10-06T13:57:23.9983852Z",
      "createdBy": 1,
      "userName": "",
      "userEmail": ""
    },
    {
      "userPermissionId": 3,
      "userId": 2,
      "clientCode": "LS0001",
      "module": "Invoice",
      "canView": true,
      "canCreate": true,
      "canEdit": true,
      "canDelete": false,
      "canExport": true,
      "canImport": false,
      "createdOn": "2025-10-06T13:57:23.9983858Z",
      "createdBy": 1,
      "userName": "",
      "userEmail": ""
    }
  ]
}
```

## Usage Examples

### 1. Using usePermissions Hook

```jsx
import usePermissions from '../hooks/usePermissions';

const ProductPage = () => {
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

### 2. Using PermissionGuard Component

```jsx
import PermissionGuard from '../components/PermissionGuard';

const ProductPage = () => {
  return (
    <div>
      <PermissionGuard module="Product" action="view">
        <ProductList />
      </PermissionGuard>
      
      <PermissionGuard module="Product" action="create">
        <button>Add Product</button>
      </PermissionGuard>
    </div>
  );
};
```

### 3. Using Redux Selectors Directly

```jsx
import { useSelector } from 'react-redux';
import { selectHasPermission, selectUserPermissions } from '../store/slices/authSlice';

const ProductPage = () => {
  const canView = useSelector(selectHasPermission('Product', 'view'));
  const permissions = useSelector(selectUserPermissions);

  return (
    <div>
      {canView && <ProductList />}
      <pre>{JSON.stringify(permissions, null, 2)}</pre>
    </div>
  );
};
```

## Benefits

1. **Simplified Architecture**: No separate permission API calls needed
2. **Better Performance**: Permissions available immediately after login
3. **Reduced Complexity**: Fewer moving parts and state management
4. **Consistent State**: Permissions always in sync with user data
5. **Backward Compatibility**: Existing components continue to work

## Migration Notes

- All existing permission components continue to work without changes
- The `usePermissions` hook API remains the same
- Permission checking logic is unchanged
- Only the data source has changed (from separate API to login response)

## Testing

Use the `PermissionTest` component (`src/components/PermissionTest.jsx`) to test the permission system:

```jsx
import PermissionTest from '../components/PermissionTest';

// Add to your routes for testing
<Route path="/permission-test" element={<PermissionTest />} />
```

This component shows:
- User information
- All permissions
- Permission tests for each module
- PermissionGuard examples
