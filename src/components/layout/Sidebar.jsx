import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Package, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Gem,
  Users,
  CreditCard,
  Package2,
  Receipt,
  UserCheck,
  Shield,
  UserCog,
  LogOut,
  Database,
  Tag,
  Palette,
  Award,
  Building,
  Calculator,
  Box,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Plus,
  Download,
  Radio,
  QrCode,
  List,
  Grid3x3
} from 'lucide-react';
import { clsx } from 'clsx';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    reports: false,
    inventory: true,
    member: false,
    master: false,
    rfidhub: false,
  });
  
  // Sidebar collapse state for large screens
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      name: 'Master Data',
      icon: Database,
      iconColor: 'text-purple-600 dark:text-purple-400',
      submenu: [
        { name: 'Categories', path: '/master/category', icon: Tag, iconColor: 'text-indigo-600 dark:text-indigo-400' },
        { name: 'Products', path: '/master/product', icon: Package, iconColor: 'text-blue-600 dark:text-blue-400' },
        { name: 'Designs', path: '/master/design', icon: Palette, iconColor: 'text-pink-600 dark:text-pink-400' },
        { name: 'Purity Levels', path: '/master/purity', icon: Award, iconColor: 'text-yellow-600 dark:text-yellow-400' },
        { name: 'Branches', path: '/master/branch', icon: Building, iconColor: 'text-green-600 dark:text-green-400' },
        { name: 'Counters', path: '/master/counter', icon: Calculator, iconColor: 'text-teal-600 dark:text-teal-400' },
        { name: 'Boxes', path: '/master/box', icon: Box, iconColor: 'text-orange-600 dark:text-orange-400' },
      ],
    },
    {
      name: 'Stock Entry',
      path: '/add-stock',
      icon: Package,
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      name: 'Inventory',
      icon: Package2,
      iconColor: 'text-cyan-600 dark:text-cyan-400',
      submenu: [
        { name: 'View Products', path: '/inventory/product-list', icon: List, iconColor: 'text-blue-600 dark:text-blue-400' },
        { name: 'Product Catalog', path: '/inventory/product-catalog', icon: Grid3x3, iconColor: 'text-purple-600 dark:text-purple-400' },
      ],
    },
    {
      name: 'RFID Hub',
      icon: Radio,
      iconColor: 'text-rose-600 dark:text-rose-400',
      submenu: [
        { name: 'Register Tag', path: '/rfid-hub/add-rfid', icon: Plus, iconColor: 'text-green-600 dark:text-green-400' },
        { name: 'All Tags', path: '/rfid-hub/all-tags', icon: QrCode, iconColor: 'text-blue-600 dark:text-blue-400' },
        { name: 'Available Tags', path: '/rfid-hub/unused-tags', icon: Tag, iconColor: 'text-orange-600 dark:text-orange-400' },
      ],
    },
    {
      name: 'Invoices',
      icon: Receipt,
      iconColor: 'text-amber-600 dark:text-amber-400',
      submenu: [
        { name: 'Manage', path: '/invoices', icon: Receipt, iconColor: 'text-amber-600 dark:text-amber-400' },
        { name: 'View All', path: '/invoices/list', icon: FileText, iconColor: 'text-blue-600 dark:text-blue-400' },
        { name: 'Create New', path: '/invoices/create', icon: Plus, iconColor: 'text-green-600 dark:text-green-400' },
        { name: 'Analytics', path: '/invoices/analytics', icon: BarChart3, iconColor: 'text-purple-600 dark:text-purple-400' },
        { name: 'Reports', path: '/invoices/reports', icon: Download, iconColor: 'text-indigo-600 dark:text-indigo-400' },
      ],
    },
    {
      name: 'Reports',
      icon: BarChart3,
      iconColor: 'text-violet-600 dark:text-violet-400',
      submenu: [
        { name: 'Stock Flow', path: '/reports/stock-movement' },
        { name: 'RFID Stats', path: '/reports/rfid-usage' },
        { name: 'Daily Balance', path: '/reports/daily-balance' },
        { name: 'Stock Check', path: '/reports/stock-verification' },
        { name: 'Activity Log', path: '/reports/daily-activity' },
        { name: 'Stock Summary', path: '/reports/stock-summary' },
        { name: 'Transfers', path: '/reports/stock-transfer' },
      ],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      iconColor: 'text-gray-600 dark:text-gray-400',
    },
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
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    onClose();
  };

  // Toggle sidebar collapse for large screens
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Handle mouse enter with delay
  const handleMouseEnter = (menuName) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredMenu(menuName);
  };

  // Handle mouse leave with delay
  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoveredMenu(null);
    }, 150); // 150ms delay
    setHoverTimeout(timeout);
  };

  const isSubmenuActive = (submenu) => {
    return submenu.some(item => location.pathname === item.path);
  };

  // Filter menu items based on user permissions
  const getFilteredMenuItems = () => {
    return menuItems.map(item => {
      if (item.submenu) {
        const filteredSubmenu = item.submenu.filter(subItem => {
          // If item requires admin access, check if user is admin
          if (subItem.requiresAdmin !== undefined) {
            return subItem.requiresAdmin ? isAdmin : true;
          }
          return true;
        });
        return { ...item, submenu: filteredSubmenu };
      }
      return item;
    });
  };

  const filteredMenuItems = getFilteredMenuItems();

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
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={clsx(
        'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-300 ease-in-out flex flex-col',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:relative lg:z-auto lg:block',
        isCollapsed ? 'w-16' : 'w-64'
      )}>
        {/* Logo and Toggle */}
        <div className="flex items-center justify-between h-20 px-6 border-b-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-3">
            <img 
              src="/images/Sparkle ERP Logo.svg" 
              alt="Sparkle ERP Logo" 
              className={isCollapsed ? "w-10 h-10" : "h-10 w-auto"}
            />
          </div>
          
          {/* Toggle button - only visible on large screens */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-110"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-4 flex-1">
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.name}>
                {item.submenu && item.submenu.length > 0 ? (
                  <div 
                    className="relative"
onMouseEnter={() => handleMouseEnter(item.name)}
onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => toggleSubmenu(item.name.toLowerCase().replace(/\s+/g, ''))}
                      className={clsx(
                        'sidebar-item w-full text-left group relative',
                        isSubmenuActive(item.submenu) ? 'sidebar-item-active' : 'sidebar-item-inactive',
                        isCollapsed && 'justify-center px-3'
                      )}
                    >
                      <item.icon className={clsx(
                        'transition-transform duration-200 group-hover:scale-110 flex-shrink-0',
                        isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3',
                        // Always use the icon color, never gray
                        item.iconColor || 'text-primary-600 dark:text-primary-400'
                      )} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 font-semibold text-base">{item.name}</span>
                          <div className="transition-transform duration-200 ease-in-out">
                            {expandedMenus[item.name.toLowerCase().replace(/\s+/g, '')] ? (
                              <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            )}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Hover tooltip for collapsed state */}
                    {isCollapsed && hoveredMenu === item.name && (
                      <div className="absolute left-full top-0 ml-2 z-40">
                        <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
                          {item.name}
                        </div>
                        {/* Arrow pointing to the icon */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                          <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                        </div>
                      </div>
                    )}
                    
                    <div className={clsx(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      expandedMenus[item.name.toLowerCase().replace(/\s+/g, '')] 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0',
                      isCollapsed && 'hidden'
                    )}>
                      <ul className="mt-2 ml-6 space-y-1.5 pb-2">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              onClick={handleLinkClick}
                              className={clsx(
                                'sidebar-item group transition-all duration-200 hover:translate-x-1',
                                isActive(subItem.path) ? 'sidebar-item-active' : 'sidebar-item-inactive'
                              )}
                            >
                              {subItem.icon && (
                                <subItem.icon className={clsx(
                                  'w-4 h-4 mr-3 transition-transform duration-200 group-hover:scale-110 flex-shrink-0',
                                  // Always use the icon color, never gray
                                  subItem.iconColor || item.iconColor || 'text-primary-600 dark:text-primary-400'
                                )} />
                              )}
                              <span className="flex-1 text-sm font-medium">{subItem.name}</span>
                              {subItem.description && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 hidden group-hover:block transition-opacity duration-200">
                                  {subItem.description}
                                </span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Collapsed submenu hover tooltip */}
                    {isCollapsed && hoveredMenu === item.name && (
                      <div 
                        className="absolute left-full top-0 ml-2 z-40"
onMouseEnter={() => handleMouseEnter(item.name)}
onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-2xl overflow-hidden border border-gray-700">
                          {item.submenu.map((subItem, index) => (
                            <Link
                              key={subItem.name}
                              to={subItem.path}
                              onClick={handleLinkClick}
                              className="block px-4 py-3 hover:bg-gray-800 dark:hover:bg-gray-600 flex items-center space-x-3 transition-colors duration-200 min-w-[180px]"
                            >
                              {subItem.icon && (
                                <subItem.icon className={clsx(
                                  'w-4 h-4 flex-shrink-0',
                                  subItem.iconColor || item.iconColor || 'text-white'
                                )} />
                              )}
                              <span className="whitespace-nowrap">{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                        {/* Arrow pointing to the icon */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                          <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div 
                    className="relative"
onMouseEnter={() => handleMouseEnter(item.name)}
onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={item.path}
                      onClick={handleLinkClick}
                      className={clsx(
                        'sidebar-item group transition-all duration-300',
                        isActive(item.path) ? 'sidebar-item-active' : 'sidebar-item-inactive',
                        isCollapsed && 'justify-center px-3'
                      )}
                    >
                      <item.icon className={clsx(
                        'transition-transform duration-200 group-hover:scale-110 flex-shrink-0',
                        isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3',
                        // Always use the icon color, never gray
                        item.iconColor || 'text-primary-600 dark:text-primary-400'
                      )} />
                      {!isCollapsed && <span className="font-semibold text-base">{item.name}</span>}
                    </Link>

                    {/* Hover tooltip for collapsed state */}
                    {isCollapsed && hoveredMenu === item.name && (
                      <div 
                        className="absolute left-full top-0 ml-2 z-40"
onMouseEnter={() => handleMouseEnter(item.name)}
onMouseLeave={handleMouseLeave}
                      >
                        <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-4 py-3 rounded-lg shadow-2xl whitespace-nowrap border border-gray-700 min-w-[120px]">
                          {item.name}
                        </div>
                        {/* Arrow pointing to the icon */}
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                          <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Section */}
        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-700">
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('logout')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleLogout}
              className={clsx(
                'w-full flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 group font-medium',
                isCollapsed && 'justify-center'
              )}
            >
              <LogOut className={clsx(
                'group-hover:scale-110 transition-transform duration-200 flex-shrink-0',
                isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'
              )} />
              {!isCollapsed && <span className="text-sm font-semibold text-black dark:text-white">Sign Out</span>}
            </button>

            {/* Hover tooltip for collapsed state */}
            {isCollapsed && hoveredMenu === 'logout' && (
              <div 
                className="absolute left-full top-0 ml-2 z-40"
                onMouseEnter={() => handleMouseEnter('logout')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-4 py-3 rounded-lg shadow-2xl whitespace-nowrap border border-gray-700 min-w-[120px]">
                  Sign Out
                </div>
                {/* Arrow pointing to the icon */}
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1">
                  <div className="w-2 h-2 bg-gray-900 dark:bg-gray-700 rotate-45"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
