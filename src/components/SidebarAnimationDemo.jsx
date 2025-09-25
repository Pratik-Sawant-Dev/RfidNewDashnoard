import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Users, Shield, UserCheck } from 'lucide-react';
import { clsx } from 'clsx';

const SidebarAnimationDemo = () => {
  const [expandedMenus, setExpandedMenus] = useState({
    member: false,
    inventory: false,
    sales: false,
  });

  const toggleSubmenu = (menuName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuName]: !prev[menuName]
    }));
  };

  const menuItems = [
    {
      name: 'Member',
      icon: Users,
      submenu: [
        { 
          name: 'Admin', 
          icon: Shield,
          description: 'Administrative functions and user management'
        },
        { 
          name: 'User', 
          icon: UserCheck,
          description: 'User profile and account management'
        },
      ],
    },
    {
      name: 'Inventory',
      icon: Users,
      submenu: [
        { name: 'Stock Management' },
        { name: 'Product Catalog' },
        { name: 'RFID Tags' },
      ],
    },
    {
      name: 'Sales',
      icon: Users,
      submenu: [
        { name: 'Point of Sale' },
        { name: 'Sales History' },
        { name: 'Customer Management' },
      ],
    },
  ];

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sidebar Animation Demo
        </h2>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <nav>
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.name.toLowerCase())}
                      className={clsx(
                        'sidebar-item w-full text-left group',
                        'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                        'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      )}
                    >
                      <item.icon className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:scale-110" />
                      <span className="flex-1">{item.name}</span>
                      <div className="transition-transform duration-200 ease-in-out">
                        {expandedMenus[item.name.toLowerCase()] ? (
                          <ChevronDown className="w-4 h-4 rotate-180" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </button>
                    
                    <div className={clsx(
                      'overflow-hidden transition-all duration-300 ease-in-out',
                      expandedMenus[item.name.toLowerCase()] 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    )}>
                      <ul className="mt-1 ml-8 space-y-1 pb-2">
                        {item.submenu.map((subItem) => (
                          <li key={subItem.name}>
                            <div className={clsx(
                              'sidebar-item group transition-all duration-200 hover:translate-x-1',
                              'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
                              'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                            )}>
                              {subItem.icon && (
                                <subItem.icon className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:scale-110" />
                              )}
                              <span className="flex-1">{subItem.name}</span>
                              {subItem.description && (
                                <span className="text-xs text-gray-400 dark:text-gray-500 hidden group-hover:block transition-opacity duration-200">
                                  {subItem.description}
                                </span>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Animation Features
          </h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Smooth expand/collapse with height and opacity transitions</li>
            <li>• Chevron rotation animation (200ms ease-in-out)</li>
            <li>• Icon scale animation on hover (110% scale)</li>
            <li>• Submenu items slide right on hover (translate-x-1)</li>
            <li>• Description tooltips appear on hover</li>
            <li>• All transitions use consistent timing (200-300ms)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarAnimationDemo;
