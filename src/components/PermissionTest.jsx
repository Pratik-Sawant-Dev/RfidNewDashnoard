import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectUserPermissions, selectHasPermission, selectModulePermissions } from '../store/slices/authSlice';
import usePermissions from '../hooks/usePermissions';
import PermissionGuard from './PermissionGuard';

/**
 * Test component to demonstrate the simplified permission system
 * This shows how permissions are now loaded directly from the login response
 */
const PermissionTest = () => {
  const user = useSelector(selectUser);
  const permissions = useSelector(selectUserPermissions);
  const { canView, canCreate, canEdit, canDelete, hasPermission } = usePermissions();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Permission System Test</h1>
      
      {/* User Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Name:</strong> {user.fullName || 'N/A'}
          </div>
          <div>
            <strong>Email:</strong> {user.email || 'N/A'}
          </div>
          <div>
            <strong>User Type:</strong> {user.userType || 'N/A'}
          </div>
          <div>
            <strong>Is Admin:</strong> {user.isAdmin ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Client Code:</strong> {user.clientCode || 'N/A'}
          </div>
          <div>
            <strong>Branch:</strong> {user.branchName || 'N/A'}
          </div>
        </div>
      </div>

      {/* Permissions List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">User Permissions</h2>
        {permissions.length > 0 ? (
          <div className="space-y-4">
            {permissions.map((permission, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-2">{permission.module}</h3>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className={`px-2 py-1 rounded ${permission.canView ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    View: {permission.canView ? '✓' : '✗'}
                  </div>
                  <div className={`px-2 py-1 rounded ${permission.canCreate ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    Create: {permission.canCreate ? '✓' : '✗'}
                  </div>
                  <div className={`px-2 py-1 rounded ${permission.canEdit ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    Edit: {permission.canEdit ? '✓' : '✗'}
                  </div>
                  <div className={`px-2 py-1 rounded ${permission.canDelete ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    Delete: {permission.canDelete ? '✓' : '✗'}
                  </div>
                  <div className={`px-2 py-1 rounded ${permission.canExport ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    Export: {permission.canExport ? '✓' : '✗'}
                  </div>
                  <div className={`px-2 py-1 rounded ${permission.canImport ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    Import: {permission.canImport ? '✓' : '✗'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No permissions found. Please log in again.</p>
        )}
      </div>

      {/* Permission Tests */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Permission Tests</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Product Module</h3>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded ${canView('Product') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can View: {canView('Product') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canCreate('Product') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can Create: {canCreate('Product') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canEdit('Product') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can Edit: {canEdit('Product') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canDelete('Product') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can Delete: {canDelete('Product') ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">RFID Module</h3>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded ${canView('RFID') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can View: {canView('RFID') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canCreate('RFID') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can Create: {canCreate('RFID') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canEdit('RFID') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can Edit: {canEdit('RFID') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canDelete('RFID') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can Delete: {canDelete('RFID') ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Invoice Module</h3>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded ${canView('Invoice') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can View: {canView('Invoice') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canCreate('Invoice') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can Create: {canCreate('Invoice') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canEdit('Invoice') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Can Edit: {canEdit('Invoice') ? 'Yes' : 'No'}
              </span>
              <span className={`px-3 py-1 rounded ${canDelete('Invoice') ? 'bg-green-100 text-red-800' : 'bg-red-100 text-red-800'}`}>
                Can Delete: {canDelete('Invoice') ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* PermissionGuard Examples */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">PermissionGuard Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Product View (with PermissionGuard)</h3>
            <PermissionGuard module="Product" action="view">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                ✅ You can view products! This content is only visible if you have Product view permission.
              </div>
            </PermissionGuard>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Product Create (with PermissionGuard)</h3>
            <PermissionGuard module="Product" action="create">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                ✅ You can create products! This content is only visible if you have Product create permission.
              </div>
            </PermissionGuard>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Admin Only (with PermissionGuard)</h3>
            <PermissionGuard module="Admin" action="view">
              <div className="p-4 bg-purple-50 border border-purple-200 rounded">
                ✅ You have admin access! This content is only visible to admins.
              </div>
            </PermissionGuard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionTest;
