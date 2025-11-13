import React from 'react';
import { Menu, Bell, User, ChevronLeft, ChevronRight, LayoutPanelLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import ThemeToggle from '../ui/ThemeToggle';
import PageSearch from './PageSearch';
import useAuth from '../../hooks/useAuth';

const Header = ({ onMenuToggle, isSidebarOpen, onRightSidebarToggle, isRightSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 lg:px-6 sticky top-0 z-40 shadow-sm">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-colors"
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
          
          {/* Page Search - Desktop */}
          <div className="hidden md:block w-full max-w-md mx-4">
            <PageSearch />
          </div>

        </div>

        {/* Mobile Search - Full Width (shown on mobile) */}
        <div className="md:hidden w-full -mx-4 px-4 pt-2 pb-2 border-t border-gray-200 dark:border-gray-700">
          <PageSearch />
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

          {/* User Info with Toggle Button */}
          <div className="flex items-center space-x-3">
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center shadow-primary">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.fullName || user?.userName || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isAdmin ? 'Administrator' : user?.userType || 'User'}
                </p>
              </div>
            </div>

            {/* Management Toggle Button */}
            <button
              onClick={onRightSidebarToggle}
              className={clsx(
                "p-2 rounded-lg transition-all duration-300 relative group ripple-effect",
                isRightSidebarOpen 
                  ? "bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 shadow-md transform scale-105" 
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 hover:shadow-sm hover:scale-105"
              )}
              title={isRightSidebarOpen ? "Close Management Panel" : "Open Management Panel"}
            >
              <div className="relative z-10">
                {/* {isRightSidebarOpen ? (
                  <ChevronRight className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                ) : (
                  <ChevronLeft className="w-5 h-5 transition-all duration-300 group-hover:scale-110 group-hover:-rotate-12" />
                )} */}
                <LayoutPanelLeft />
              </div>
              
              {/* Active indicator */}
              {isRightSidebarOpen && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary-500 rounded-full pulse-indicator z-20"></div>
              )}
              
              {/* Background glow effect */}
              <div className={clsx(
                "absolute inset-0 rounded-lg transition-all duration-300",
                isRightSidebarOpen 
                  ? "bg-primary-200 dark:bg-primary-800 opacity-30 shadow-lg" 
                  : "bg-gray-200 dark:bg-gray-600 opacity-0 group-hover:opacity-20"
              )}></div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;