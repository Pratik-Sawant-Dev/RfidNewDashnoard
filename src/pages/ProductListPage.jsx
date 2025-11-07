import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Loader2,
  RefreshCw,
  Search,
  X,
  Pencil,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';
import Card from '../components/ui/Card';
import Pagination from '../components/ui/Pagination';
import { ToastContainer } from '../components/ui/Toast';
import apiService from '../services/apiService';
import useToast from '../hooks/useToast';

const ProductListPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  
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
      product.branchName?.toLowerCase().includes(query) ||
      product.counterName?.toLowerCase().includes(query) ||
      product.designName?.toLowerCase().includes(query) ||
      product.purityName?.toLowerCase().includes(query)
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

  // Format currency
  const formatCurrency = (value) => {
    if (!value && value !== 0) return '₹0.00';
    return `₹${parseFloat(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Format weight
  const formatWeight = (value) => {
    if (!value && value !== 0) return '-';
    return `${parseFloat(value).toFixed(2)}g`;
  };


  // Handle view product details
  const handleView = (product) => {
    const id = product.id || product.productId;
    if (id) {
      navigate(`/inventory/product/${id}`);
    } else {
      error('Product ID not found');
    }
  };

  // Extract backend message helper
  const extractBackendMessage = (response, defaultMessage) => {
    if (!response) return defaultMessage;
    
    if (typeof response === 'string') return response;
    
    if (response.message) return String(response.message);
    if (response.Message) return String(response.Message);
    if (response.data?.message) return String(response.data.message);
    if (response.data?.Message) return String(response.data.Message);
    if (response.error) return String(response.error);
    if (response.Error) return String(response.Error);
    if (response.data?.error) return String(response.data.error);
    if (response.data?.Error) return String(response.data.Error);
    
    return defaultMessage;
  };

  // Handle edit action
  const handleEdit = (product) => {
    const id = product.id || product.productId;
    if (id) {
      navigate(`/inventory/product/${id}/edit`);
    } else {
      error('Product ID not found');
    }
  };

  // Handle delete action
  const handleDelete = async (product) => {
    const id = product.id || product.productId;
    if (!id) {
      error('Product ID not found');
      return;
    }

    const productName = product.itemCode || product.productName || 'this product';
    
    if (!window.confirm(`Are you sure you want to delete product "${productName}"?\n\nThis action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.deleteProduct(id);
      
      const message = extractBackendMessage(response, `Product "${productName}" deleted successfully`);
      success(message);
      
      // Reload products after deletion
      await loadProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      console.error('Error response:', err.response);
      console.error('Error response data:', err.response?.data);
      
      let errorMessage = 'Failed to delete product. Please try again.';
      
      if (err.response?.data) {
        const responseData = err.response.data;
        if (responseData.message) {
          errorMessage = String(responseData.message);
        } else if (responseData.Message) {
          errorMessage = String(responseData.Message);
        } else if (responseData.error) {
          errorMessage = String(responseData.error);
        } else if (responseData.Error) {
          errorMessage = String(responseData.Error);
        } else if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (Array.isArray(responseData) && responseData.length > 0) {
          errorMessage = String(responseData[0]);
        }
      } else if (err.response?.message) {
        errorMessage = String(err.response.message);
      } else if (err.message) {
        errorMessage = String(err.message);
      }
      
      error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="w-full space-y-6 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
            <span>Product List</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mt-1">
            View and manage all products in your inventory
          </p>
        </div>

        {/* Main Card */}
        <Card className="w-full">
          {/* Header Section with Search and Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Products ({filteredProducts.length})
              </h2>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 flex-1 sm:max-w-md">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-10 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {/* Refresh Button */}
              <button
                onClick={loadProducts}
                disabled={loading}
                className="min-w-[160px] flex items-center justify-center gap-2 px-4 py-2 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-4 animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading products...
              </p>
            </div>
          ) : paginatedProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                {searchQuery ? 'No products found' : 'No products available'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {searchQuery 
                  ? 'Try adjusting your search criteria.' 
                  : 'Start by adding products to your inventory.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Item Code
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      RFID Code
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Category
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Product
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Branch
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Counter
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Design
                    </th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Purity
                    </th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Gross Wt (g)
                    </th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Net Wt (g)
                    </th>
                    <th className="text-right py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      MRP
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Status
                    </th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedProducts.map((product, index) => (
                    <tr
                      key={product.id || index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => handleView(product)}
                    >
                      <td className="py-2 px-2">
                        <span className="font-medium text-gray-900 dark:text-white text-xs">
                          {product.itemCode || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-gray-600 dark:text-gray-300 font-mono text-xs">
                          {product.rfidCode || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {product.categoryName || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {product.productName || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {product.branchName || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {product.counterName || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {product.designName || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {product.purityName || '-'}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {formatWeight(product.grossWeight)}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <span className="text-gray-600 dark:text-gray-300 text-xs">
                          {formatWeight(product.netWeight)}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-right">
                        <span className="font-semibold text-gray-900 dark:text-white text-xs">
                          {formatCurrency(product.mrp)}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center justify-center">
                          {product.status === 'Active' || product.isActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                              <XCircle className="w-3 h-3 mr-1" />
                              Inactive
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleView(product)}
                            className="p-1.5 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200"
                            title="View Product Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                            title="Edit Product"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredProducts.length}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
                rowsPerPageOptions={[10, 25, 30, 50, 100]}
              />
            </div>
          )}
        </Card>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </div>
  );
};

export default ProductListPage;
