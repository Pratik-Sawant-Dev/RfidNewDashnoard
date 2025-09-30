import React, { useState, useEffect } from 'react';
import { X, Save, User, Phone, MapPin, Shield, Mail, Building, Lock, Check, X as XIcon } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';
import apiService from '../../services/apiService';

const UserForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user = null, 
  title = "Add User",
  isAdmin = false 
}) => {
  const [branches, setBranches] = useState([]);
  const [counters, setCounters] = useState([]);
  const [permissions, setPermissions] = useState([]);
  
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: {
      userName: user?.userName || '',
      email: user?.email || '',
      password: '',
      fullName: user?.fullName || '',
      mobileNumber: user?.mobileNumber || '',
      city: user?.city || '',
      address: user?.address || '',
      organisationName: user?.organisationName || '',
      showroomType: user?.showroomType || '',
      branchId: user?.branchId || '',
      counterId: user?.counterId || '',
    },
  });

  // Load branches and counters on component mount
  useEffect(() => {
    if (isOpen) {
      loadBranches();
      loadCounters();
      initializePermissions();
    }
  }, [isOpen]);

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
      canView: user?.permissions?.find(p => p.module === module)?.canView || false,
      canCreate: user?.permissions?.find(p => p.module === module)?.canCreate || false,
      canEdit: user?.permissions?.find(p => p.module === module)?.canEdit || false,
      canDelete: user?.permissions?.find(p => p.module === module)?.canDelete || false,
      canExport: user?.permissions?.find(p => p.module === module)?.canExport || false,
      canImport: user?.permissions?.find(p => p.module === module)?.canImport || false,
    }));
    setPermissions(defaultPermissions);
  };

  React.useEffect(() => {
    if (user) {
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
      // Reset form to empty values when user is null (add mode)
      reset({
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
      });
    }
  }, [user, reset]);

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

  const handleFormSubmit = async (data) => {
    try {
      const formDataWithPermissions = {
        ...data,
        permissions: permissions
      };
      await onSubmit(formDataWithPermissions);
      // Don't close immediately - let the parent handle closing after success
    } catch (error) {
      // If there's an error, the parent will handle it
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    // Reset form to empty values when closing
    reset({
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
    });
    setPermissions([]);
    onClose();
  };

  const showroomTypes = [
    { value: 'Luxury', label: 'Luxury' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Standard', label: 'Standard' },
    { value: 'Budget', label: 'Budget' },
  ];


  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <div className="p-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              {isAdmin ? (
                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              ) : (
                <User className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {user ? 'Update user information' : 'Add a new user to the system'}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <User className="w-5 h-5 mr-2 text-primary-500" />
                Basic Information
              </h3>
              
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
                  />
                )}
              />

              {!user && (
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
                  />
                )}
              />
            </div>

            {/* Location & Organization */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Building className="w-5 h-5 mr-2 text-primary-500" />
                Location & Organization
              </h3>

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
                  />
                )}
              />
            </div>
          </div>

          {/* Branch & Counter Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Building className="w-5 h-5 mr-2 text-primary-500" />
              Branch & Counter Assignment
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Controller
                name="branchId"
                control={control}
                rules={{ required: 'Branch is required' }}
                render={({ field }) => (
                  <Select
                    label="Branch *"
                    placeholder="Select branch"
                    error={errors.branchId?.message}
                    options={branches.map(branch => ({
                      value: branch.id || branch.branchId,
                      label: branch.branchName || branch.name
                    }))}
                    {...field}
                  />
                )}
              />

              <Controller
                name="counterId"
                control={control}
                rules={{ required: 'Counter is required' }}
                render={({ field }) => (
                  <Select
                    label="Counter *"
                    placeholder="Select counter"
                    error={errors.counterId?.message}
                    options={counters.map(counter => ({
                      value: counter.id || counter.counterId,
                      label: counter.counterName || counter.name
                    }))}
                    {...field}
                  />
                )}
              />
            </div>
          </div>

          {/* Permissions Management */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary-500" />
              User Permissions
            </h3>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.module} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {permission.module} Module
                      </h4>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => toggleAllPermissions(permission.module, true)}
                          className="text-xs text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Select All
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                          type="button"
                          onClick={() => toggleAllPermissions(permission.module, false)}
                          className="text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { key: 'canView', label: 'View' },
                        { key: 'canCreate', label: 'Create' },
                        { key: 'canEdit', label: 'Edit' },
                        { key: 'canDelete', label: 'Delete' },
                        { key: 'canExport', label: 'Export' },
                        { key: 'canImport', label: 'Import' }
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={permission[key]}
                            onChange={(e) => handlePermissionChange(permission.module, key, e.target.checked)}
                            className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex items-center"
            >
              <Save className="w-4 h-4 mr-2" />
              {user ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default UserForm;
