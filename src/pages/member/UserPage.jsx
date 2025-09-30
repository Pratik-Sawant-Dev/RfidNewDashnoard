import React, { useState, useEffect } from 'react';
import { User, UserCheck, Edit3, Key, Bell, Shield, Calendar, MapPin, Phone, Mail, Plus, Trash2, Eye, RefreshCw } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import DataTable from '../../components/crud/DataTable';
import UserForm from '../../components/crud/UserForm';
import PermissionsModal from '../../components/ui/PermissionsModal';
import useToast from '../../hooks/useToast';
import { registerSubUser, getUsersUnderAdmin, updateUser, deleteUser } from '../../services/userApi';
import { ToastContainer } from '../../components/ui/Toast';
import ConfirmAlert from '../../components/ui/ConfirmAlert';

const UserPage = () => {
  const { user, organizationInfo } = useAuth();
  const { success, error, toasts, removeToast } = useToast();
  
  // State for CRUD operations
  const [users, setUsers] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, users: [] });
  const [permissionsModal, setPermissionsModal] = useState({ isOpen: false, user: null });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await getUsersUnderAdmin();
      setUsers(response || []);
    } catch (err) {
      console.error('Failed to fetch users:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch users. Please try again.';
      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Table columns configuration
  const columns = [
    {
      key: 'userName',
      header: 'Username',
      accessor: 'userName',
      sortable: true,
    },
    {
      key: 'fullName',
      header: 'Full Name',
      accessor: 'fullName',
      sortable: true,
    },
    {
      key: 'email',
      header: 'Email',
      accessor: 'email',
      sortable: true,
    },
    {
      key: 'userType',
      header: 'Type',
      accessor: 'userType',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Admin' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
          value === 'Manager' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'branchId',
      header: 'Branch',
      accessor: 'branchId',
      sortable: true,
      render: (value) => `Branch ${value}`,
    },
    {
      key: 'counterId',
      header: 'Counter',
      accessor: 'counterId',
      sortable: true,
      render: (value) => `Counter ${value}`,
    },
    {
      key: 'permissions',
      header: 'Permissions',
      accessor: 'permissions',
      sortable: false,
      render: (permissions, row) => {
        return (
          <div className="flex items-center justify-center">
            <button
              onClick={() => setPermissionsModal({ isOpen: true, user: row })}
              className="p-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200 flex items-center gap-2"
              title="View detailed permissions"
            >
              <Eye className="w-4 h-4" />
              <span className="text-sm font-medium">View</span>
            </button>
          </div>
        );
      },
    },
    {
      key: 'isActive',
      header: 'Status',
      accessor: 'isActive',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      key: 'lastLoginDate',
      header: 'Last Login',
      accessor: 'lastLoginDate',
      sortable: true,
      render: (value) => value ? new Date(value).toLocaleString() : 'Never',
    },
  ];

  // CRUD Operations
  const handleAddUser = () => {
    setEditingUser(null);
    setIsFormOpen(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setIsFormOpen(true);
  };

  const handleViewUser = (user) => {
    setViewingUser(user);
    // You can implement a view modal here
    console.log('Viewing user:', user);
  };

  const handleDeleteUser = (usersToDelete) => {
    setDeleteConfirm({ isOpen: true, users: usersToDelete });
  };

  const confirmDelete = async () => {
    try {
      setIsLoading(true);
      
      // Delete users one by one
      const deletePromises = deleteConfirm.users.map(user => 
        deleteUser(user.userId || user.id)
      );
      
      await Promise.all(deletePromises);
      
      // Refresh the user list
      await fetchUsers();
      success(`${deleteConfirm.users.length} user(s) deleted successfully`);
      setDeleteConfirm({ isOpen: false, users: [] });
    } catch (err) {
      console.error('Failed to delete users:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete users. Please try again.';
      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setIsLoading(true);
      
      // Debug: Log current user and token
      console.log('Current user:', user);
      console.log('Token from Redux:', user?.token);
      console.log('Token from localStorage:', localStorage.getItem('authToken'));
      
      if (editingUser) {
        // Update existing user - include all updatable fields
        const updatePayload = {
          userName: formData.userName,
          email: formData.email,
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          city: formData.city,
          address: formData.address,
          organisationName: formData.organisationName,
          showroomType: formData.showroomType,
          branchId: parseInt(formData.branchId),
          counterId: parseInt(formData.counterId),
          permissions: formData.permissions || [],
          isAdmin: false,
          userType: 'User',
          isActive: true
        };
        
        console.log('Update payload:', updatePayload);
        await updateUser(editingUser.userId || editingUser.id, updatePayload);
        success('User updated successfully');
        
        // Refresh the user list and close form
        await fetchUsers();
        setIsFormOpen(false);
      } else {
        // Add new user - include all required fields
        const createPayload = {
          userName: formData.userName,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          mobileNumber: formData.mobileNumber,
          city: formData.city,
          address: formData.address,
          organisationName: formData.organisationName,
          showroomType: formData.showroomType,
          branchId: parseInt(formData.branchId),
          counterId: parseInt(formData.counterId),
          permissions: formData.permissions || [],
          isAdmin: false,
          userType: 'User',
          adminUserId: user?.userId || user?.id // Use current user's ID as admin
        };
        
        console.log('Create payload:', createPayload);
        await registerSubUser(createPayload);
        success('User created successfully');
        
        // Refresh the user list and close form
        await fetchUsers();
        setIsFormOpen(false);
      }
    } catch (err) {
      console.error('Failed to save user:', err);
      console.error('Error response:', err.response);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save user. Please try again.';
      error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        {/* Mobile Layout */}
        <div className="block sm:hidden space-y-4">
          {/* Title Section */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <User className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white truncate">
                User Management
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 truncate">
                Create, read, update, and delete user accounts
              </p>
            </div>
          </div>
          
          {/* Refresh Button - Mobile */}
          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={fetchUsers}
              disabled={isLoading}
              className="flex items-center space-x-2 text-sm px-3 py-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create, read, update, and delete user accounts
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={fetchUsers}
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* User CRUD Table */}
      <DataTable
        data={users}
        columns={columns}
        onAdd={handleAddUser}
        onEdit={handleEditUser}
        onView={handleViewUser}
        onDelete={handleDeleteUser}
        title="Users"
        addButtonText="Add User"
        searchPlaceholder="Search users..."
        searchable={true}
        filterable={true}
        exportable={true}
        isLoading={isLoading}
      />

      {/* User Form Modal */}
      <UserForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        user={editingUser}
        title={editingUser ? 'Edit User' : 'Add New User'}
        isAdmin={false}
      />

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Delete Confirmation Alert */}
      <ConfirmAlert
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, users: [] })}
        onConfirm={confirmDelete}
        title="Delete Users"
        message={`Are you sure you want to delete ${deleteConfirm.users.length} user(s)? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Permissions Modal */}
      <PermissionsModal
        isOpen={permissionsModal.isOpen}
        onClose={() => setPermissionsModal({ isOpen: false, user: null })}
        user={permissionsModal.user}
        title="User Permissions Details"
      />
    </div>
  );
};

export default UserPage;
