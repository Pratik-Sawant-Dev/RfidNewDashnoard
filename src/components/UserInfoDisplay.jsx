import React from 'react';
import { User, Building, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import useAuth from '../hooks/useAuth';

const UserInfoDisplay = () => {
  const { user, isAdmin, organizationInfo } = useAuth();

  if (!user) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
        <p className="text-gray-500 dark:text-gray-400">No user information available</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.fullName || user.userName}
          </h2>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              isAdmin 
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {isAdmin ? 'Administrator' : user.userType}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              user.isActive 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {user.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <User className="w-5 h-5 mr-2 text-primary-500" />
            Personal Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600 dark:text-gray-300">{user.email}</span>
            </div>
            {user.mobileNumber && (
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{user.mobileNumber}</span>
              </div>
            )}
            {user.city && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{user.city}</span>
              </div>
            )}
            {user.address && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{user.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Organization Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-primary-500" />
            Organization Information
          </h3>
          <div className="space-y-3">
            {organizationInfo.name && (
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">{organizationInfo.name}</span>
              </div>
            )}
            {organizationInfo.clientCode && (
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Code: {organizationInfo.clientCode}</span>
              </div>
            )}
            {organizationInfo.showroomType && (
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300">Type: {organizationInfo.showroomType}</span>
              </div>
            )}
            {organizationInfo.databaseName && (
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600 dark:text-gray-300 text-xs">
                  DB: {organizationInfo.databaseName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-primary-500" />
          Account Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.createdOn && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Created On</p>
              <p className="text-gray-900 dark:text-white">
                {new Date(user.createdOn).toLocaleDateString()}
              </p>
            </div>
          )}
          {user.lastLoginDate && (
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="text-gray-900 dark:text-white">
                {new Date(user.lastLoginDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInfoDisplay;
