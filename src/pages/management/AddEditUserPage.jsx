import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { ArrowLeft, Save, User, Phone, MapPin, Shield, Mail, Building, Lock } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import useToast from '../../hooks/useToast';
import { ToastContainer } from '../../components/ui/Toast';
import { registerSubUser, getUsersUnderAdmin, updateUser } from '../../services/userApi';
import apiService from '../../services/apiService';
import useAuth from '../../hooks/useAuth';

const AddEditUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  
  // Determine where to navigate back - check if coming from admin or user page
  const getReturnPath = () => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('isAdmin') === 'true') {
      return '/member/admin';
    }
    return '/member/user';
  };
  const { success, error, toasts, removeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [counters, setCounters] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const isEditMode = !!id;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      fullName: '',
      mobileNumber: '',
      city: '',
      address: '',
      organisationName: '',
      showroomType: '',
      branchId: '',
      counterId: '',
    },
  });

  // Load user data if editing
  useEffect(() => {
    if (isEditMode) {
      loadUserData();
    }
    loadBranches();
    loadCounters();
  }, [id, isEditMode]);

  // Initialize permissions after user data is loaded
  useEffect(() => {
    if (editingUser || !isEditMode) {
      initializePermissions();
    }
  }, [editingUser, isEditMode]);

  const loadUserData = async () => {
    try {
      setInitialLoading(true);
      const users = await getUsersUnderAdmin();
      const user = users.find(u => (u.userId || u.id) === id);
      if (user) {
        setEditingUser(user);
        reset({
          userName: user.userName || '',
          email: user.email || '',
          password: '',
          fullName: user.fullName || '',
          mobileNumber: user.mobileNumber || '',
          city: user.city || '',
          address: user.address || '',
          organisationName: user.organisationName || '',
          showroomType: user.showroomType || '',
          branchId: user.branchId || '',
          counterId: user.counterId || '',
        });
      } else {
        error('User not found');
        navigate(getReturnPath());
      }
    } catch (err) {
      console.error('Failed to load user:', err);
      error('Failed to load user data');
      navigate(getReturnPath());
    } finally {
      setInitialLoading(false);
    }
  };

  const loadBranches = async () => {
    try {
      const response = await apiService.getBranches();
      let branchesArray = [];
      if (Array.isArray(response)) {
        branchesArray = response;
      } else if (response && Array.isArray(response.data)) {
        branchesArray = response.data;
      } else if (response && response.branches && Array.isArray(response.branches)) {
        branchesArray = response.branches;
      }
      setBranches(branchesArray);
    } catch (err) {
      console.error('Error loading branches:', err);
    }
  };

  const loadCounters = async () => {
    try {
      const response = await apiService.getCounters();
      let countersArray = [];
      if (Array.isArray(response)) {
        countersArray = response;
      } else if (response && Array.isArray(response.data)) {
        countersArray = response.data;
      } else if (response && response.counters && Array.isArray(response.counters)) {
        countersArray = response.counters;
      }
      setCounters(countersArray);
    } catch (err) {
      console.error('Error loading counters:', err);
    }
  };

  const initializePermissions = () => {
    const defaultModules = ['Product', 'RFID', 'Invoice'];
    const defaultPermissions = defaultModules.map(module => ({
      module,
      canView: editingUser?.permissions?.find(p => p.module === module)?.canView || false,
      canCreate: editingUser?.permissions?.find(p => p.module === module)?.canCreate || false,
      canEdit: editingUser?.permissions?.find(p => p.module === module)?.canEdit || false,
      canDelete: editingUser?.permissions?.find(p => p.module === module)?.canDelete || false,
      canExport: editingUser?.permissions?.find(p => p.module === module)?.canExport || false,
      canImport: editingUser?.permissions?.find(p => p.module === module)?.canImport || false,
    }));
    setPermissions(defaultPermissions);
  };

  const handlePermissionChange = (module, permission, value) => {
    setPermissions(prev =>
      prev.map(p =>
        p.module === module
          ? { ...p, [permission]: value }
          : p
      )
    );
  };

  const toggleAllPermissions = (module, value) => {
    setPermissions(prev =>
      prev.map(p =>
        p.module === module
          ? {
              ...p,
              canView: value,
              canCreate: value,
              canEdit: value,
              canDelete: value,
              canExport: value,
              canImport: value
            }
          : p
      )
    );
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formDataWithPermissions = {
        ...data,
        permissions: permissions
      };

      if (isEditMode && editingUser) {
        // Update existing user
        const updatePayload = {
          userName: formDataWithPermissions.userName,
          email: formDataWithPermissions.email,
          fullName: formDataWithPermissions.fullName,
          mobileNumber: formDataWithPermissions.mobileNumber,
          city: formDataWithPermissions.city,
          address: formDataWithPermissions.address,
          organisationName: formDataWithPermissions.organisationName,
          showroomType: formDataWithPermissions.showroomType,
          branchId: formDataWithPermissions.branchId,
          counterId: formDataWithPermissions.counterId,
          permissions: formDataWithPermissions.permissions,
        };

        // Only include password if provided
        if (formDataWithPermissions.password) {
          updatePayload.password = formDataWithPermissions.password;
        }

        await updateUser(editingUser.userId || editingUser.id, updatePayload);
        success('User updated successfully');
      } else {
        // Create new user
        await registerSubUser(formDataWithPermissions);
        success('User created successfully');
      }

      // Navigate back to users list
      setTimeout(() => {
        navigate(getReturnPath());
      }, 1000);
    } catch (err) {
      console.error('Failed to save user:', err);
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${isEditMode ? 'update' : 'create'} user`;
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showroomTypes = [
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Budget', label: 'Budget' },
  ];

  if (initialLoading) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <Link
          to={getReturnPath()}
          className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to {new URLSearchParams(location.search).get('isAdmin') === 'true' ? 'Admins' : 'Users'}
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 sm:p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                {isEditMode ? 'Edit User' : 'Add New User'}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1">
                {isEditMode ? 'Update user information' : 'Add a new user to the system'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="p-4 sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
          {/* Basic Information */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Controller
                name="userName"
                control={control}
                rules={{ required: 'Username is required' }}
                render={({ field }) => (
                  <Input
                    label="Username"
                    placeholder="Enter username (e.g., user1@jewelrystore.com)"
                    error={errors.userName?.message}
                    icon={User}
                    {...field}
                    required
                  />
                )}
              />

              <Controller
                name="email"
                control={control}
                rules={{
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Email is invalid',
                  },
                }}
                render={({ field }) => (
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    error={errors.email?.message}
                    icon={Mail}
                    {...field}
                    required
                  />
                )}
              />

              {!isEditMode && (
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  }}
                  render={({ field }) => (
                    <Input
                      label="Password"
                      type="password"
                      placeholder="Enter password (e.g., User@123)"
                      error={errors.password?.message}
                      icon={Lock}
                      {...field}
                      required
                    />
                  )}
                />
              )}

              {isEditMode && (
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    }
                  }}
                  render={({ field }) => (
                    <Input
                      label="New Password (Optional)"
                      type="password"
                      placeholder="Leave empty to keep current password"
                      error={errors.password?.message}
                      icon={Lock}
                      {...field}
                    />
                  )}
                />
              )}

              <Controller
                name="fullName"
                control={control}
                rules={{ required: 'Full name is required' }}
                render={({ field }) => (
                  <Input
                    label="Full Name"
                    placeholder="Enter full name"
                    error={errors.fullName?.message}
                    icon={User}
                    {...field}
                    required
                  />
                )}
              />

              <Controller
                name="mobileNumber"
                control={control}
                rules={{ required: 'Mobile number is required' }}
                render={({ field }) => (
                  <Input
                    label="Mobile Number"
                    placeholder="Enter mobile number (e.g., +91-9876543212)"
                    error={errors.mobileNumber?.message}
                    icon={Phone}
                    {...field}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Location & Organization */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Location & Organization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Controller
                name="city"
                control={control}
                rules={{ required: 'City is required' }}
                render={({ field }) => (
                  <Input
                    label="City"
                    placeholder="Enter city"
                    error={errors.city?.message}
                    icon={MapPin}
                    {...field}
                    required
                  />
                )}
              />

              <Controller
                name="address"
                control={control}
                rules={{ required: 'Address is required' }}
                render={({ field }) => (
                  <Input
                    label="Address"
                    placeholder="Enter address"
                    error={errors.address?.message}
                    icon={MapPin}
                    {...field}
                    required
                  />
                )}
              />

              <Controller
                name="organisationName"
                control={control}
                rules={{ required: 'Organization name is required' }}
                render={({ field }) => (
                  <Input
                    label="Organization Name"
                    placeholder="Enter organization name"
                    error={errors.organisationName?.message}
                    icon={Building}
                    {...field}
                    required
                  />
                )}
              />

              <Controller
                name="showroomType"
                control={control}
                rules={{ required: 'Showroom type is required' }}
                render={({ field }) => (
                  <Select
                    label="Showroom Type"
                    placeholder="Select showroom type"
                    error={errors.showroomType?.message}
                    options={showroomTypes}
                    {...field}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Branch & Counter Assignment */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <Building className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600 dark:text-primary-400" />
              Branch & Counter Assignment
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <Controller
                name="branchId"
                control={control}
                rules={{ required: 'Branch is required' }}
                render={({ field }) => (
                  <Select
                    label="Branch"
                    placeholder="Select branch"
                    error={errors.branchId?.message}
                    options={branches.map(branch => ({
                      value: branch.id || branch.branchId,
                      label: branch.branchName || branch.name
                    }))}
                    {...field}
                    required
                  />
                )}
              />

              <Controller
                name="counterId"
                control={control}
                rules={{ required: 'Counter is required' }}
                render={({ field }) => (
                  <Select
                    label="Counter"
                    placeholder="Select counter"
                    error={errors.counterId?.message}
                    options={counters.map(counter => ({
                      value: counter.id || counter.counterId,
                      label: counter.counterName || counter.name
                    }))}
                    {...field}
                    required
                  />
                )}
              />
            </div>
          </div>

          {/* Permissions Management */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-primary-600 dark:text-primary-400" />
              User Permissions
            </h3>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {permissions.map((permission) => (
                  <div key={permission.module} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {permission.module} Module
                      </h4>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => toggleAllPermissions(permission.module, true)}
                          className="text-xs sm:text-sm text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => toggleAllPermissions(permission.module, false)}
                          className="text-xs sm:text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                      {[
                        { key: 'canView', label: 'View' },
                        { key: 'canCreate', label: 'Create' },
                        { key: 'canEdit', label: 'Edit' },
                        { key: 'canDelete', label: 'Delete' },
                        { key: 'canExport', label: 'Export' },
                        { key: 'canImport', label: 'Import' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <input
                            type="checkbox"
                            checked={permission[key]}
                            onChange={(e) => handlePermissionChange(permission.module, key, e.target.checked)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(getReturnPath())}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {isEditMode ? 'Update User' : 'Create User'}
                </>
              )}
            </Button>
          </div>
        </form>
      </Card>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default AddEditUserPage;

