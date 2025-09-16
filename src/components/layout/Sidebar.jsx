import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  Receipt
} from 'lucide-react';
import { clsx } from 'clsx';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({
    reports: false,
    inventory: false,
  });

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: Home,
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

  const isSubmenuActive = (submenu) => {
    return submenu.some(item => location.pathname === item.path);
  };

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
        'fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0 lg:relative lg:z-auto lg:block'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
          <div className="flex items-center space-x-2">
            <Gem className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold text-gradient font-elegant">
              JewelRFID
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.name}>
                {item.submenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name.toLowerCase().replace(' ', ''))}
                      className={clsx(
                        'sidebar-item w-full text-left',
                        isSubmenuActive(item.submenu) ? 'sidebar-item-active' : 'sidebar-item-inactive'
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3" />
                      <span className="flex-1">{item.name}</span>
                      {expandedMenus[item.name.toLowerCase().replace(' ', '')] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    
                    {expandedMenus[item.name.toLowerCase().replace(' ', '')] && (
                      <ul className="mt-1 ml-8 space-y-1">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <Link
                              to={subItem.path}
                              className={clsx(
                                'sidebar-item',
                                isActive(subItem.path) ? 'sidebar-item-active' : 'sidebar-item-inactive'
                              )}
                            >
                              <span className="ml-6">{subItem.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    className={clsx(
                      'sidebar-item',
                      isActive(item.path) ? 'sidebar-item-active' : 'sidebar-item-inactive'
                    )}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
