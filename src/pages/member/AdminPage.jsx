import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Settings, UserPlus, UserCheck, AlertTriangle, Database, Activity } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Card from '../../components/ui/Card';
import DataTable from '../../components/crud/DataTable';
import useToast from '../../hooks/useToast';

const AdminPage = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { success, error } = useToast();
  
  // State for CRUD operations
  const [admins, setAdmins] = useState([
    // Sample data - in real app, this would come from API
    {
      id: 1,
      userName: 'admin_super',
      email: 'admin@jewelrfid.com',
      fullName: 'Super Admin',
      mobileNumber: '1111111111',
      city: 'Mumbai',
      address: 'Admin Office, Mumbai',
      organisationName: 'JewelRFID System',
      showroomType: 'Luxury',
      userType: 'Admin',
      isAdmin: true,
      isActive: true,
      createdOn: '2024-01-01T00:00:00Z',
      lastLoginDate: '2024-01-20T10:30:00Z'
    },
    {
      id: 2,
      userName: 'admin_tech',
      email: 'tech@jewelrfid.com',
      fullName: 'Tech Admin',
      mobileNumber: '2222222222',
      city: 'Delhi',
      address: 'Tech Office, Delhi',
      organisationName: 'JewelRFID System',
      showroomType: 'Premium',
      userType: 'Admin',
      isAdmin: true,
      isActive: true,
      createdOn: '2024-01-05T00:00:00Z',
      lastLoginDate: '2024-01-19T15:45:00Z'
    }
  ]);
  const [viewingAdmin, setViewingAdmin] = useState(null);

  // Redirect non-admin users
  if (!isAdmin) {
    return (
      <div className="p-6">
        <Card>
          <div className="text-center py-12">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Access Denied
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              You don't have administrator privileges to access this page.
            </p>
          </div>
        </Card>
      </div>
    );
  }

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
      key: 'organisationName',
      header: 'Organization',
      accessor: 'organisationName',
      sortable: true,
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
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Never',
    },
  ];

  // CRUD Operations
  const handleAddAdmin = () => {
    navigate('/management/users/add?isAdmin=true');
  };

  const handleEditAdmin = (admin) => {
    navigate(`/management/users/edit/${admin.id}?isAdmin=true`);
  };

  const handleViewAdmin = (admin) => {
    setViewingAdmin(admin);
    // You can implement a view modal here
    console.log('Viewing admin:', admin);
  };

  const handleDeleteAdmin = (adminsToDelete) => {
    if (window.confirm(`Are you sure you want to delete ${adminsToDelete.length} admin(s)?`)) {
      const idsToDelete = adminsToDelete.map(a => a.id);
      setAdmins(prev => prev.filter(admin => !idsToDelete.includes(admin.id)));
      success(`${adminsToDelete.length} admin(s) deleted successfully`);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Admin Management
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Create, read, update, and delete administrator accounts
            </p>
          </div>
        </div>
        
        {/* Admin Info */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-3">
            <UserCheck className="w-5 h-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Logged in as Administrator
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                {user?.fullName} ({user?.email})
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Admin CRUD Table */}
      <DataTable
        data={admins}
        columns={columns}
        onAdd={handleAddAdmin}
        onEdit={handleEditAdmin}
        onView={handleViewAdmin}
        onDelete={handleDeleteAdmin}
        title="Administrators"
        addButtonText="Add Admin"
        searchPlaceholder="Search admins..."
        searchable={true}
        filterable={true}
        exportable={true}
      />

      {/* System Overview */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          System Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Total Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{admins.length}</p>
              </div>
              <Shield className="w-8 h-8 text-red-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Active Admins</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {admins.filter(a => a.isActive).length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">System Health</p>
                <p className="text-2xl font-bold text-green-600">98%</p>
              </div>
              <Database className="w-8 h-8 text-green-500" />
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-300">Last Activity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">2h</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
