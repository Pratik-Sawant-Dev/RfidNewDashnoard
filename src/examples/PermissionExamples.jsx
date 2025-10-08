import React from 'react';
import usePermissions from '../hooks/usePermissions';
import PermissionGuard from '../components/PermissionGuard';

/**
 * Examples of how to use the permission system
 */

// ============================================
// Example 1: Using PermissionGuard Component
// ============================================
export const ProductManagementExample = () => {
  return (
    <div>
      <h1>Product Management</h1>
      
      {/* Only show if user can view products */}
      <PermissionGuard module="Product" action="view">
        <div>
          <h2>Product List</h2>
          <p>Here are all the products...</p>
        </div>
      </PermissionGuard>

      {/* Only show if user can create products */}
      <PermissionGuard module="Product" action="create">
        <button>Add New Product</button>
      </PermissionGuard>

      {/* Only show if user can edit products */}
      <PermissionGuard module="Product" action="edit">
        <button>Edit Product</button>
      </PermissionGuard>

      {/* Only show if user can delete products */}
      <PermissionGuard module="Product" action="delete">
        <button>Delete Product</button>
      </PermissionGuard>
    </div>
  );
};

// ============================================
// Example 2: Using usePermissions Hook
// ============================================
export const RFIDManagementExample = () => {
  const { canView, canCreate, canEdit, canDelete, canExport, canImport } = usePermissions();

  return (
    <div>
      <h1>RFID Management</h1>
      
      {canView('RFID') && (
        <div>
          <h2>RFID Tags</h2>
          <p>List of RFID tags...</p>
        </div>
      )}

      {canCreate('RFID') && (
        <button>Add RFID Tag</button>
      )}

      {canEdit('RFID') && (
        <button>Edit RFID Tag</button>
      )}

      {canDelete('RFID') && (
        <button>Delete RFID Tag</button>
      )}

      {canExport('RFID') && (
        <button>Export RFID Data</button>
      )}

      {canImport('RFID') && (
        <button>Import RFID Data</button>
      )}
    </div>
  );
};

// ============================================
// Example 3: Conditional Rendering with Permissions
// ============================================
export const InvoiceManagementExample = () => {
  const { hasPermission, getModulePermissions } = usePermissions();

  const invoicePermissions = getModulePermissions('Invoice');

  return (
    <div>
      <h1>Invoice Management</h1>
      
      {/* Show different content based on permissions */}
      {hasPermission('Invoice', 'view') ? (
        <div>
          <h2>Invoices</h2>
          <p>Invoice list here...</p>
          
          {hasPermission('Invoice', 'create') && (
            <button>Create Invoice</button>
          )}
          
          {hasPermission('Invoice', 'edit') && (
            <button>Edit Invoice</button>
          )}
        </div>
      ) : (
        <div className="text-center p-8">
          <p>You don't have permission to view invoices</p>
        </div>
      )}

      {/* Show permission details for debugging */}
      {invoicePermissions && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h3>Your Invoice Permissions:</h3>
          <ul>
            <li>View: {invoicePermissions.canView ? 'Yes' : 'No'}</li>
            <li>Create: {invoicePermissions.canCreate ? 'Yes' : 'No'}</li>
            <li>Edit: {invoicePermissions.canEdit ? 'Yes' : 'No'}</li>
            <li>Delete: {invoicePermissions.canDelete ? 'Yes' : 'No'}</li>
            <li>Export: {invoicePermissions.canExport ? 'Yes' : 'No'}</li>
            <li>Import: {invoicePermissions.canImport ? 'Yes' : 'No'}</li>
          </ul>
        </div>
      )}
    </div>
  );
};

// ============================================
// Example 4: Navigation Menu with Permissions
// ============================================
export const NavigationWithPermissions = () => {
  const { canView } = usePermissions();

  return (
    <nav>
      <a href="/dashboard">Dashboard</a>
      
      {canView('Product') && (
        <a href="/products">Products</a>
      )}
      
      {canView('RFID') && (
        <a href="/rfid">RFID Management</a>
      )}
      
      {canView('Invoice') && (
        <a href="/invoices">Invoices</a>
      )}
      
      {canView('Reports') && (
        <a href="/reports">Reports</a>
      )}
    </nav>
  );
};

// ============================================
// Example 5: Button with Permission Check
// ============================================
export const PermissionButton = ({ module, action, children, onClick, ...props }) => {
  const { hasPermission } = usePermissions();

  if (!hasPermission(module, action)) {
    return null; // Don't render button if no permission
  }

  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  );
};

// Usage:
// <PermissionButton module="Product" action="create" onClick={handleCreate}>
//   Add Product
// </PermissionButton>

// ============================================
// Example 6: Table with Permission-based Actions
// ============================================
export const ProductTableExample = () => {
  const { canEdit, canDelete, canExport } = usePermissions();

  const products = [
    { id: 1, name: 'Gold Ring', price: 1000 },
    { id: 2, name: 'Diamond Necklace', price: 5000 },
  ];

  return (
    <div>
      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>${product.price}</td>
              <td>
                {canEdit('Product') && (
                  <button onClick={() => editProduct(product.id)}>
                    Edit
                  </button>
                )}
                {canDelete('Product') && (
                  <button onClick={() => deleteProduct(product.id)}>
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {canExport('Product') && (
        <button onClick={exportProducts}>
          Export Products
        </button>
      )}
    </div>
  );
};

// ============================================
// Example 7: Loading State with Permissions
// ============================================
export const LoadingWithPermissions = () => {
  const { permissions, isLoading, error } = usePermissions();

  if (isLoading) {
    return <div>Loading permissions...</div>;
  }

  if (error) {
    return <div>Error loading permissions: {error}</div>;
  }

  if (permissions.length === 0) {
    return <div>No permissions found</div>;
  }

  return (
    <div>
      <h2>Your Permissions</h2>
      <ul>
        {permissions.map(permission => (
          <li key={permission.userPermissionId}>
            <strong>{permission.module}:</strong>
            {permission.canView && ' View'}
            {permission.canCreate && ' Create'}
            {permission.canEdit && ' Edit'}
            {permission.canDelete && ' Delete'}
            {permission.canExport && ' Export'}
            {permission.canImport && ' Import'}
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============================================
// Example 8: Custom Permission Check Component
// ============================================
export const CustomPermissionCheck = ({ module, action, children, fallback }) => {
  const { hasPermission } = usePermissions();

  if (hasPermission(module, action)) {
    return children;
  }

  return fallback || null;
};

// Usage:
// <CustomPermissionCheck 
//   module="Product" 
//   action="create"
//   fallback={<div>You can't create products</div>}
// >
//   <CreateProductForm />
// </CustomPermissionCheck>
