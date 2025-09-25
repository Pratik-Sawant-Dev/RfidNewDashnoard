import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  UserPlus, 
  Shield, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown, 
  ChevronRight,
  UserCheck,
  Bell,
  Key,
  Database,
  Activity,
  BarChart3,
  FileText,
  HelpCircle,
  Info,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  MoreHorizontal
} from 'lucide-react';
import { clsx } from 'clsx';
import useAuth from '../../hooks/useAuth';

const RightSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, logout, organizationInfo } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    management: false,
    settings: false,
    profile: false,
  });

  const managementItems = [
    {
      name: 'Add User',
      path: '/member/user',
      icon: UserPlus,
      description: 'Create new user accounts',
      color: 'text-blue-500',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      name: 'Add Admin',
      path: '/member/admin',
      icon: Shield,
      description: 'Create administrator accounts',
      color: 'text-red-500',
      bgColor: 'bg-red-100 dark:bg-red-900',
      requiresAdmin: true
    },
    {
      name: 'User Management',
      path: '/management/users',
      icon: UserCheck,
      description: 'Manage all user accounts',
      color: 'text-green-500',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      name: 'System Monitoring',
      path: '/management/monitoring',
      icon: Activity,
      description: 'Monitor system performance',
      color: 'text-purple-500',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      requiresAdmin: true
    }
  ];

  const settingsItems = [
    {
      name: 'Profile Settings',
      path: '/settings/profile',
      icon: User,
      description: 'Update your profile information'
    },
    {
      name: 'Account Settings',
      path: '/settings/account',
      icon: Settings,
      description: 'Manage account preferences'
    },
    {
      name: 'Security Settings',
      path: '/settings/security',
      icon: Key,
      description: 'Password and security options'
    },
    {
      name: 'Notification Settings',
      path: '/settings/notifications',
      icon: Bell,
      description: 'Configure notifications'
    },
    {
      name: 'System Settings',
      path: '/settings/system',
      icon: Database,
      description: 'System configuration',
      requiresAdmin: true
    }
  ];

  const profileItems = [
    {
      name: 'Personal Info',
      path: '/profile/personal',
      icon: User,
      description: 'View and edit personal information'
    },
    {
      name: 'Contact Info',
      path: '/profile/contact',
      icon: Phone,
      description: 'Manage contact details'
    },
    {
      name: 'Organization',
      path: '/profile/organization',
      icon: Building,
      description: 'Organization information'
    },
    {
      name: 'Activity Log',
      path: '/profile/activity',
      icon: Activity,
      description: 'View account activity'
    }
  ];

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = () => {
    // Close sidebar when any link is clicked
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  // Filter items based on user permissions
  const getFilteredItems = (items) => {
    return items.filter(item => {
      if (item.requiresAdmin !== undefined) {
        return item.requiresAdmin ? isAdmin : true;
      }
      return true;
    });
  };

  // Close sidebar on Escape key press
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
       {/* Backdrop - Click outside to close */}
       <div 
         className={clsx(
           'fixed inset-0 bg-black z-40 cursor-pointer',
           isOpen ? 'backdrop-fade-in' : 'backdrop-fade-out pointer-events-none'
         )}
         onClick={onClose}
         title="Click to close"
       />
      
      {/* Right Sidebar */}
      <div 
        className={clsx(
          'fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 z-50 shadow-2xl',
          isOpen ? 'sidebar-slide-in' : 'sidebar-slide-out'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              Management
            </span>
          </div>
           <button
             onClick={onClose}
             className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 hover:scale-110"
             title="Close Management Panel"
           >
             <span className="text-gray-500 dark:text-gray-400 text-xl font-bold">×</span>
           </button>
        </div>

        {/* User Profile Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {user?.fullName || user?.userName || 'User'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {user?.email || 'user@example.com'}
              </p>
              <div className="flex items-center mt-1">
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  user?.isActive ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}></div>
                <span className={`text-xs font-medium ${
                  user?.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {user?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          
          {organizationInfo.name && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {organizationInfo.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {organizationInfo.clientCode}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <ul className="space-y-2">
             {/* Management Section */}
             <li>
               <button
                 onClick={() => toggleSubmenu('management')}
                 className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
               >
                <UserPlus className="w-5 h-5 mr-3 text-blue-500" />
                <span className="flex-1 font-medium">Management</span>
                <div className="transition-transform duration-200 ease-in-out">
                  {expandedMenus.management ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>
              
              <div className={clsx(
                'overflow-hidden transition-all duration-300 ease-in-out',
                expandedMenus.management ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}>
                <ul className="mt-2 ml-4 space-y-1">
                  {getFilteredItems(managementItems).map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={handleLinkClick}
                        className={clsx(
                           'flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group hover:translate-x-1',
                          isActive(item.path) && 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        )}
                      >
                        <div className={`w-8 h-8 ${item.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

             {/* Settings Section */}
             <li>
               <button
                 onClick={() => toggleSubmenu('settings')}
                 className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
               >
                <Settings className="w-5 h-5 mr-3 text-gray-500" />
                <span className="flex-1 font-medium">Settings</span>
                <div className="transition-transform duration-200 ease-in-out">
                  {expandedMenus.settings ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>
              
              <div className={clsx(
                'overflow-hidden transition-all duration-300 ease-in-out',
                expandedMenus.settings ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}>
                <ul className="mt-2 ml-4 space-y-1">
                  {getFilteredItems(settingsItems).map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={handleLinkClick}
                        className={clsx(
                           'flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group hover:translate-x-1',
                          isActive(item.path) && 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        )}
                      >
                        <item.icon className="w-4 h-4 mr-3 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

             {/* Profile Section */}
             <li>
               <button
                 onClick={() => toggleSubmenu('profile')}
                 className="w-full flex items-center px-3 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
               >
                <User className="w-5 h-5 mr-3 text-green-500" />
                <span className="flex-1 font-medium">Profile</span>
                <div className="transition-transform duration-200 ease-in-out">
                  {expandedMenus.profile ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>
              
              <div className={clsx(
                'overflow-hidden transition-all duration-300 ease-in-out',
                expandedMenus.profile ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              )}>
                <ul className="mt-2 ml-4 space-y-1">
                  {profileItems.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.path}
                        onClick={handleLinkClick}
                        className={clsx(
                           'flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 group hover:translate-x-1',
                          isActive(item.path) && 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                        )}
                      >
                        <item.icon className="w-4 h-4 mr-3 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>

            {/* Quick Actions */}
            <li className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Quick Actions
                </p>
                <div className="space-y-1">
                  <Link
                    to="/help"
                    onClick={handleLinkClick}
                    className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <HelpCircle className="w-4 h-4 mr-3" />
                    <span className="text-sm">Help & Support</span>
                  </Link>
                  <Link
                    to="/about"
                    onClick={handleLinkClick}
                    className="flex items-center px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
                  >
                    <Info className="w-4 h-4 mr-3" />
                    <span className="text-sm">About</span>
                  </Link>
                </div>
              </div>
            </li>
          </ul>
        </nav>

        {/* Footer - Logout */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group"
          >
            <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;
