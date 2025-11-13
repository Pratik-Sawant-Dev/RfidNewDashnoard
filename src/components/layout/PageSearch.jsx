import React, { useState, useRef, useEffect } from 'react';
import { Search, X, LayoutDashboard, Package, FileText, BarChart3, Settings, Radio, Users, User, Box, Tag, TrendingUp, ShoppingCart, Plus, List, Grid3x3, Eye, Pencil, Receipt, Download, QrCode } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// All searchable pages with their metadata
const searchablePages = [
  // Dashboard
  {
    name: 'Dashboard',
    path: '/dashboard',
    category: 'Main',
    icon: LayoutDashboard,
    keywords: ['dashboard', 'home', 'main', 'overview', 'statistics', 'stats'],
  },
  
  // Inventory
  {
    name: 'Add Stock',
    path: '/add-stock',
    category: 'Inventory',
    icon: Plus,
    keywords: ['add stock', 'add product', 'new product', 'stock', 'inventory'],
  },
  {
    name: 'Product List',
    path: '/inventory/product-list',
    category: 'Inventory',
    icon: List,
    keywords: ['product list', 'products', 'view products', 'all products', 'items'],
  },
  {
    name: 'Product Catalog',
    path: '/inventory/product-catalog',
    category: 'Inventory',
    icon: Grid3x3,
    keywords: ['product catalog', 'catalog', 'browse products', 'product gallery'],
  },
  
  // Invoices
  {
    name: 'Invoice Management',
    path: '/invoices',
    category: 'Invoices',
    icon: Receipt,
    keywords: ['invoice', 'invoices', 'manage invoice', 'invoice management', 'billing'],
  },
  {
    name: 'Invoice List',
    path: '/invoices/list',
    category: 'Invoices',
    icon: List,
    keywords: ['invoice list', 'all invoices', 'view invoices', 'invoice history'],
  },
  {
    name: 'Create Invoice',
    path: '/invoices/create',
    category: 'Invoices',
    icon: Plus,
    keywords: ['create invoice', 'new invoice', 'add invoice', 'generate invoice'],
  },
  {
    name: 'Invoice Analytics',
    path: '/invoices/analytics',
    category: 'Invoices',
    icon: TrendingUp,
    keywords: ['invoice analytics', 'invoice stats', 'invoice analysis', 'sales analytics'],
  },
  {
    name: 'Invoice Reports',
    path: '/invoices/reports',
    category: 'Invoices',
    icon: FileText,
    keywords: ['invoice reports', 'invoice report', 'reports', 'invoice data'],
  },
  
  // RFID Hub
  {
    name: 'Register RFID Tag',
    path: '/rfid-hub/add-rfid',
    category: 'RFID Hub',
    icon: Plus,
    keywords: ['register tag', 'add rfid', 'new rfid', 'register rfid', 'rfid tag'],
  },
  {
    name: 'All RFID Tags',
    path: '/rfid-hub/all-tags',
    category: 'RFID Hub',
    icon: QrCode,
    keywords: ['all tags', 'all rfid', 'rfid tags', 'tags list', 'view tags'],
  },
  {
    name: 'Available RFID Tags',
    path: '/rfid-hub/unused-tags',
    category: 'RFID Hub',
    icon: Tag,
    keywords: ['available tags', 'unused tags', 'free tags', 'available rfid'],
  },
  
  // Reports
  {
    name: 'Stock Movement Report',
    path: '/reports/stock-movement',
    category: 'Reports',
    icon: BarChart3,
    keywords: ['stock movement', 'stock flow', 'movement report', 'stock transfer'],
  },
  {
    name: 'RFID Usage Report',
    path: '/reports/rfid-usage',
    category: 'Reports',
    icon: Radio,
    keywords: ['rfid usage', 'rfid stats', 'rfid report', 'tag usage'],
  },
  {
    name: 'Daily Balance Report',
    path: '/reports/daily-balance',
    category: 'Reports',
    icon: BarChart3,
    keywords: ['daily balance', 'balance report', 'daily report', 'balance'],
  },
  {
    name: 'Stock Verification Report',
    path: '/reports/stock-verification',
    category: 'Reports',
    icon: Package,
    keywords: ['stock verification', 'stock check', 'verification', 'inventory check'],
  },
  {
    name: 'Daily Activity Report',
    path: '/reports/daily-activity',
    category: 'Reports',
    icon: FileText,
    keywords: ['daily activity', 'activity log', 'activity report', 'log'],
  },
  {
    name: 'Stock Summary Report',
    path: '/reports/stock-summary',
    category: 'Reports',
    icon: BarChart3,
    keywords: ['stock summary', 'summary report', 'stock overview', 'inventory summary'],
  },
  {
    name: 'Stock Transfer Report',
    path: '/reports/stock-transfer',
    category: 'Reports',
    icon: TrendingUp,
    keywords: ['stock transfer', 'transfer report', 'transfers', 'stock movement'],
  },
  
  // Master Data
  {
    name: 'Category Management',
    path: '/master/category',
    category: 'Master Data',
    icon: Box,
    keywords: ['category', 'categories', 'category management', 'manage category'],
  },
  {
    name: 'Product Master',
    path: '/master/product',
    category: 'Master Data',
    icon: Package,
    keywords: ['product master', 'master product', 'product management', 'products'],
  },
  {
    name: 'Design Management',
    path: '/master/design',
    category: 'Master Data',
    icon: Tag,
    keywords: ['design', 'designs', 'design management', 'manage design'],
  },
  {
    name: 'Purity Management',
    path: '/master/purity',
    category: 'Master Data',
    icon: Tag,
    keywords: ['purity', 'purities', 'purity management', 'manage purity'],
  },
  {
    name: 'Branch Management',
    path: '/master/branch',
    category: 'Master Data',
    icon: Box,
    keywords: ['branch', 'branches', 'branch management', 'manage branch'],
  },
  {
    name: 'Counter Management',
    path: '/master/counter',
    category: 'Master Data',
    icon: Box,
    keywords: ['counter', 'counters', 'counter management', 'manage counter'],
  },
  {
    name: 'Box Management',
    path: '/master/box',
    category: 'Master Data',
    icon: Box,
    keywords: ['box', 'boxes', 'box management', 'manage box'],
  },
  
  // Management
  {
    name: 'User Management',
    path: '/management/users',
    category: 'Management',
    icon: Users,
    keywords: ['user management', 'users', 'manage users', 'user list'],
  },
  {
    name: 'System Monitoring',
    path: '/management/monitoring',
    category: 'Management',
    icon: BarChart3,
    keywords: ['system monitoring', 'monitoring', 'system stats', 'system'],
  },
  
  // Settings
  {
    name: 'Settings',
    path: '/settings',
    category: 'Settings',
    icon: Settings,
    keywords: ['settings', 'configuration', 'config', 'preferences', 'setup'],
  },
];

const PageSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [filteredPages, setFilteredPages] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter pages based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPages([]);
      setIsOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = searchablePages.filter((page) => {
      const nameMatch = page.name.toLowerCase().includes(query);
      const keywordMatch = page.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query)
      );
      const categoryMatch = page.category.toLowerCase().includes(query);
      return nameMatch || keywordMatch || categoryMatch;
    });

    setFilteredPages(filtered);
    setIsOpen(filtered.length > 0);
    setSelectedIndex(-1);
  }, [searchQuery]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close when route changes
  useEffect(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || filteredPages.length === 0) {
      if (e.key === 'Enter' && searchQuery.trim()) {
        // Try to navigate to first result if available
        const query = searchQuery.toLowerCase().trim();
        const firstMatch = searchablePages.find((page) => {
          const nameMatch = page.name.toLowerCase().includes(query);
          const keywordMatch = page.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query)
          );
          return nameMatch || keywordMatch;
        });
        if (firstMatch) {
          navigate(firstMatch.path);
          setSearchQuery('');
          setIsOpen(false);
        }
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredPages.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredPages.length) {
          handlePageSelect(filteredPages[selectedIndex]);
        } else if (filteredPages.length > 0) {
          handlePageSelect(filteredPages[0]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        inputRef.current?.blur();
        break;
    }
  };

  const handlePageSelect = (page) => {
    navigate(page.path);
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (e.target.value.trim()) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="relative w-full max-w-full md:max-w-md" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredPages.length > 0 && searchQuery.trim()) {
              setIsOpen(true);
            }
          }}
          placeholder="Search pages..."
          className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0077D4]/50 focus:border-transparent transition-all"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4 text-gray-400 dark:text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && filteredPages.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50"
        >
          <div className="p-2">
            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wide">
              {filteredPages.length} {filteredPages.length === 1 ? 'result' : 'results'}
            </div>
            {filteredPages.map((page, index) => {
              const Icon = page.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={page.path}
                  onClick={() => handlePageSelect(page)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#0077D4]/10 to-[#D60000]/10 border border-[#0077D4]/20 dark:border-[#0077D4]/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-br from-[#0077D4] to-[#D60000] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {highlightMatch(page.name, searchQuery)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {page.category}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="text-xs text-gray-400 dark:text-gray-500 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                      →
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery.trim() && filteredPages.length === 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-6 text-center z-50"
        >
          <Search className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            No pages found for "<span className="font-medium">{searchQuery}</span>"
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Try searching for dashboard, products, invoices, reports, or settings
          </p>
        </div>
      )}
    </div>
  );
};

export default PageSearch;

