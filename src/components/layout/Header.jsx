import React, { useState, useRef, useEffect } from 'react';
import { Menu, Bell, User, Search, LogOut, Settings, UserCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import Input from '../ui/Input';
import apiService from '../../services/apiService';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      // Call logout API endpoint
      await apiService.logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with logout even if API call fails
    } finally {
      // Clear local storage and session data
      localStorage.removeItem('authToken');
      sessionStorage.clear();
      
      // Navigate to landing page
      navigate('/');
      
      // Close dropdown
      setIsDropdownOpen(false);
    }
  };

  // Handle profile click
  const handleProfileClick = () => {
    navigate('/settings');
    setIsDropdownOpen(false);
  };
  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 lg:px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-colors"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Search */}
          <div className="hidden md:block w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products, customers..."
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-primary">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Store Manager</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-slide-up">
                {/* User Info Section */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-primary">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">John Doe</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">john.doe@jewelrfid.com</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={handleProfileClick}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <UserCircle className="w-4 h-4 mr-3 text-gray-500 group-hover:text-primary-600" />
                    Profile Settings
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/settings');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                  >
                    <Settings className="w-4 h-4 mr-3 text-gray-500 group-hover:text-primary-600" />
                    App Settings
                  </button>
                  
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-2 mx-4"></div>
                  
                  <div className="px-4 py-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Account Status</p>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-xs text-green-600 dark:text-green-400 font-medium">Active</span>
                    </div>
                  </div>
                </div>

                {/* Logout Section */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors group"
                  >
                    <LogOut className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
