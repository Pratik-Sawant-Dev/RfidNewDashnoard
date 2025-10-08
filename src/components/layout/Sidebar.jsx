import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  FileText, 
  BarChart3, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Gem,
  Users,
  CreditCard,
  TrendingUp,
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
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { clsx } from 'clsx';
import useAuth from '../../hooks/useAuth';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAdmin, user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({
    reports: false,
    inventory: false,
    sales: false,
    member: false,
    master: false,
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
    },
    {
      name: 'Master',
      icon: Database,
      submenu: [
        { name: 'Category', path: '/master/category', icon: Tag },
        { name: 'Product', path: '/master/product', icon: Package },
        { name: 'Design', path: '/master/design', icon: Palette },
        { name: 'Purity', path: '/master/purity', icon: Award },
        { name: 'Branch', path: '/master/branch', icon: Building },
        { name: 'Counter', path: '/master/counter', icon: Calculator },
        { name: 'Box', path: '/master/box', icon: Box },
      ],
    },
    {
      name: 'Purchase Entry',
      path: '/purchase-entry',
      icon: ShoppingCart,
    },
    {
      name: 'Add Stock',
      path: '/add-stock',
      icon: Package,
    },
    {
      name: 'Inventory',
      icon: Package2,
      submenu: [
        { name: 'Stock Management', path: '/inventory/stock' },
        { name: 'Product Catalog', path: '/inventory/catalog' },
        { name: 'RFID Tags', path: '/inventory/rfid-tags' },
      ],
    },
    {
      name: 'Sales',
      icon: TrendingUp,
      submenu: [
        { name: 'Point of Sale', path: '/sales/pos' },
        { name: 'Sales History', path: '/sales/history' },
        { name: 'Customer Management', path: '/sales/customers' },
      ],
    },
    {
      name: 'Invoices',
      path: '/invoices',
      icon: Receipt,
    },
    {
      name: 'Reports',
      icon: BarChart3,
      submenu: [
        { name: 'Stock Reports', path: '/reports/stock' },
        { name: 'Sales Reports', path: '/reports/sales' },
        { name: 'Purchase Reports', path: '/reports/purchase' },
        { name: 'Financial Reports', path: '/reports/financial' },
      ],
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
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
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            <Gem className="w-8 h-8 text-primary-500" />
            {!isCollapsed && (
              <span className="text-xl font-bold text-gradient font-elegant">
                JewelRFID
              </span>
            )}
          </div>
          
          {/* Toggle button - only visible on large screens */}
          <button
            onClick={toggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1">
          <ul className="space-y-1">
            {filteredMenuItems.map((item) => (
              <li key={item.name}>
                {item.submenu && item.submenu.length > 0 ? (
                  <div 
                    className="relative"
onMouseEnter={() => handleMouseEnter(item.name)}
onMouseLeave={handleMouseLeave}
                  >
                    <button
                      onClick={() => toggleSubmenu(item.name.toLowerCase().replace(' ', ''))}
                      className={clsx(
                        'sidebar-item w-full text-left group relative',
                        isSubmenuActive(item.submenu) ? 'sidebar-item-active' : 'sidebar-item-inactive',
                        isCollapsed && 'justify-center px-3'
                      )}
                    >
                      <item.icon className={clsx(
                        'transition-transform duration-200 group-hover:scale-110',
                        isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'
                      )} />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          <div className="transition-transform duration-200 ease-in-out">
                            {expandedMenus[item.name.toLowerCase().replace(' ', '')] ? (
                              <ChevronDown className="w-4 h-4 rotate-180" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </div>
                        </>
                      )}
                    </button>

                    {/* Hover tooltip for collapsed state */}
                    {isCollapsed && hoveredMenu === item.name && (
                      <div className="absolute left-full top-0 ml-2 z-50">
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
                      expandedMenus[item.name.toLowerCase().replace(' ', '')] 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0',
                      isCollapsed && 'hidden'
                    )}>
                      <ul className="mt-1 ml-8 space-y-1 pb-2">
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
                                <subItem.icon className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                              )}
                              <span className="flex-1">{subItem.name}</span>
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
                        className="absolute left-full top-0 ml-2 z-[99999]"
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
                                <subItem.icon className="w-4 h-4 flex-shrink-0" />
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
                        'sidebar-item group transition-all duration-200 hover:translate-x-1',
                        isActive(item.path) ? 'sidebar-item-active' : 'sidebar-item-inactive',
                        isCollapsed && 'justify-center px-3'
                      )}
                    >
                      <item.icon className={clsx(
                        'transition-transform duration-200 group-hover:scale-110',
                        isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'
                      )} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>

                    {/* Hover tooltip for collapsed state */}
                    {isCollapsed && hoveredMenu === item.name && (
                      <div 
                        className="absolute left-full top-0 ml-2 z-[99999]"
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
        <div className="mt-auto p-3 border-t border-gray-200 dark:border-gray-700">
          <div 
            className="relative"
            onMouseEnter={() => handleMouseEnter('logout')}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={handleLogout}
              className={clsx(
                'w-full flex items-center px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 group',
                isCollapsed && 'justify-center'
              )}
            >
              <LogOut className={clsx(
                'group-hover:scale-110 transition-transform duration-200',
                isCollapsed ? 'w-5 h-5' : 'w-5 h-5 mr-3'
              )} />
              {!isCollapsed && <span className="text-sm font-medium">Sign Out</span>}
            </button>

            {/* Hover tooltip for collapsed state */}
            {isCollapsed && hoveredMenu === 'logout' && (
              <div 
                className="absolute left-full top-0 ml-2 z-[99999]"
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
