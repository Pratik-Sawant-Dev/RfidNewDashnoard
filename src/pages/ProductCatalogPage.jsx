import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Loader2,
  RefreshCw,
  Search,
  X,
  Image as ImageIcon,
  Eye,
  Pencil,
  Download,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Pagination from '../components/ui/Pagination';
import { ToastContainer } from '../components/ui/Toast';
import apiService from '../services/apiService';
import useToast from '../hooks/useToast';

const ProductCatalogPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);
  
  const { error, success, toasts, removeToast } = useToast();

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllProducts();
      const productsData = Array.isArray(response) ? response : (response.data || response || []);
      setProducts(productsData);
    } catch (err) {
      console.error('Error loading products:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load products';
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Search and filter
  const filteredProducts = products.filter((product) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      product.itemCode?.toLowerCase().includes(query) ||
      product.rfidCode?.toLowerCase().includes(query) ||
      product.categoryName?.toLowerCase().includes(query) ||
      product.productName?.toLowerCase().includes(query) ||
      product.designName?.toLowerCase().includes(query)
    );
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCurrentPage(1);
  };

  // Format weight
  const formatWeight = (value) => {
    if (!value && value !== 0) return '-';
    return `${parseFloat(value).toFixed(2)}g`;
  };

  // Handle view product details
  const handleView = (product, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const id = product.id || product.productId;
    if (id) {
      navigate(`/inventory/product/${id}`);
    } else {
      error('Product ID not found. Cannot view product details.');
    }
  };

  // Handle edit product
  const handleEdit = (product, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const id = product.id || product.productId;
    if (id) {
      navigate(`/inventory/product/${id}/edit`);
    } else {
      error('Product ID not found. Cannot edit product.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full space-y-4 p-4 sm:p-6">
        {/* Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 sm:w-6 sm:h-6" />
            Product Catalog
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            Browse and manage all products in card view ({filteredProducts.length} products)
          </p>
        </div>

        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={loadProducts}
              disabled={loading}
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              className="flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 text-sm border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : paginatedProducts.length === 0 ? (
          <Card>
            <div className="text-center py-20">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                {searchQuery ? 'No products found matching your search' : 'No products available'}
              </p>
            </div>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4">
              {paginatedProducts.map((product) => (
                <div
                  key={product.id || product.productId}
                  className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group max-w-[180px] mx-auto w-full"
                >
                  {/* Product Image */}
                  <div className="relative w-full aspect-square bg-gray-100 dark:bg-gray-700 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.productName || product.itemCode || 'Product'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const placeholder = e.target.nextElementSibling;
                          if (placeholder) placeholder.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      className={`${
                        product.imageUrl ? 'hidden' : 'flex'
                      } absolute inset-0 items-center justify-center bg-gray-100 dark:bg-gray-700`}
                    >
                      <ImageIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-2 space-y-1.5">
                    {/* Item Code */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        Item
                      </span>
                      <span className="text-[10px] font-semibold text-gray-900 dark:text-white truncate">
                        {product.itemCode || '-'}
                      </span>
                    </div>

                    {/* RFID Code */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        RFID
                      </span>
                      <span className="text-[10px] font-semibold text-gray-900 dark:text-white truncate">
                        {product.rfidCode || '-'}
                      </span>
                    </div>

                    {/* Category */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        Cat
                      </span>
                      <span className="text-[10px] font-semibold text-gray-900 dark:text-white truncate">
                        {product.categoryName || '-'}
                      </span>
                    </div>

                    {/* Product Name */}
                    <div className="pt-1 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                        {product.productName || '-'}
                      </p>
                    </div>

                    {/* Design */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        Design
                      </span>
                      <span className="text-[10px] font-semibold text-gray-900 dark:text-white truncate">
                        {product.designName || '-'}
                      </span>
                    </div>

                    {/* Gross Weight */}
                    <div className="flex items-center justify-between gap-1 pt-1 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                        Gross
                      </span>
                      <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                        {formatWeight(product.grossWeight)}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <button
                        type="button"
                        onClick={(e) => handleView(product, e)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white dark:bg-gray-800 border-2 border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded text-[10px] font-medium transition-colors cursor-pointer"
                        title="View Product Details"
                      >
                        <Eye className="w-3 h-3" />
                        <span className="hidden min-[375px]:inline">View</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleEdit(product, e)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 bg-white dark:bg-gray-800 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded text-[10px] font-medium transition-colors cursor-pointer"
                        title="Edit Product"
                      >
                        <Pencil className="w-3 h-3" />
                        <span className="hidden min-[375px]:inline">Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                totalItems={filteredProducts.length}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            )}
          </>
        )}
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default ProductCatalogPage;

