import React from 'react';
import { X, Save, User, Phone, MapPin, Shield, Mail, Building, Lock } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Modal from '../ui/Modal';

const UserForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user = null, 
  title = "Add User",
  isAdmin = false 
}) => {
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
    },
  });

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
      });
    }
  }, [user, reset]);

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
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
    });
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
