import React from 'react';
import { X, Shield, Eye, Plus, Edit, Trash2, Download, Upload, Check, X as XIcon } from 'lucide-react';
import Modal from './Modal';
import Button from './Button';

const PermissionsModal = ({ 
  isOpen, 
  onClose, 
  user, 
  title = "User Permissions" 
}) => {
  if (!user || !user.permissions) {
    return null;
  }

  const permissions = user.permissions || [];
  const permissionIcons = {
    canView: Eye,
    canCreate: Plus,
    canEdit: Edit,
    canDelete: Trash2,
    canExport: Download,
    canImport: Upload
  };

  const permissionLabels = {
    canView: 'View',
    canCreate: 'Create',
    canEdit: 'Edit',
    canDelete: 'Delete',
    canExport: 'Export',
    canImport: 'Import'
  };

  const getPermissionIcon = (permission) => {
    const IconComponent = permissionIcons[permission];
    return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
  };

  const getModuleColor = (module) => {
    const colors = {
      'Product': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'RFID': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Invoice': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Reports': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'Settings': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[module] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Shield className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                {user.fullName} ({user.userName})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* User Info - Compact */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 mb-3">
          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Email:</span>
              <p className="text-gray-900 dark:text-white truncate">{user.email}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Branch:</span>
              <p className="text-gray-900 dark:text-white">{user.branchId || 'Not assigned'}</p>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Counter:</span>
              <p className="text-gray-900 dark:text-white">{user.counterId || 'Not assigned'}</p>
            </div>
          </div>
        </div>

        {/* Permissions Overview - Compact */}
        <div className="mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
            Module Permissions
          </h3>
          
          {permissions.length === 0 ? (
            <div className="text-center py-4">
              <Shield className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No permissions assigned</p>
            </div>
          ) : (
            <div className="space-y-2">
              {permissions.map((permission) => (
                <div key={permission.module} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                  {/* Module Header - Compact */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getModuleColor(permission.module)}`}>
                        {permission.module}
                      </span>
                      {Object.keys(permissionLabels).some(key => permission[key]) ? (
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">
                          Active
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          No Permissions
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {Object.keys(permissionLabels).filter(key => permission[key]).length}/{Object.keys(permissionLabels).length}
                    </span>
                  </div>

                  {/* Permission Details - Compact Grid */}
                  <div className="grid grid-cols-3 gap-1">
                    {Object.entries(permissionLabels).map(([key, label]) => (
                      <div
                        key={key}
                        className={`flex items-center space-x-1 p-1.5 rounded text-xs ${
                          permission[key] 
                            ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' 
                            : 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        <div className={`p-0.5 rounded ${
                          permission[key] 
                            ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-300' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                        }`}>
                          {permission[key] ? (
                            <Check className="w-2.5 h-2.5" />
                          ) : (
                            <XIcon className="w-2.5 h-2.5" />
                          )}
                        </div>
                        <span className="truncate">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Summary Statistics - Compact */}
        {permissions.length > 0 && (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-3">
            <h4 className="text-xs font-medium text-blue-900 dark:text-blue-300 mb-2">
              Summary
            </h4>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="text-center">
                <div className="text-blue-700 dark:text-blue-300">Modules</div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {permissions.filter(p => Object.keys(permissionLabels).some(key => p[key])).length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-blue-700 dark:text-blue-300">Total</div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {permissions.reduce((total, p) => 
                    total + Object.keys(permissionLabels).filter(key => p[key]).length, 0
                  )}
                </div>
              </div>
              <div className="text-center">
                <div className="text-blue-700 dark:text-blue-300">View</div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {permissions.filter(p => p.canView).length}
                </div>
              </div>
              <div className="text-center">
                <div className="text-blue-700 dark:text-blue-300">Admin</div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {permissions.filter(p => p.canDelete || p.canImport).length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer - Compact */}
        <div className="flex justify-end pt-2 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="secondary"
            onClick={onClose}
            className="text-sm px-3 py-1.5"
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PermissionsModal;
