import React, { useState, useEffect } from 'react';
import { 
  Grid3X3, 
  List, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  Loader2,
  AlertCircle,
  Plus,
  RefreshCw
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Modal from '../components/ui/Modal';
import Pagination from '../components/ui/Pagination';
import apiService from '../services/apiService';
import useToast from '../hooks/useToast';

const InventoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const { success, error } = useToast();

  // Load products on component mount
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await apiService.getAllProducts();
      setProducts(response.data || response || []);
    } catch (err) {
      console.error('Error loading products:', err);
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchQuery === '' || 
      product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.itemCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.rfidCode?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || product.categoryName === selectedCategory;
    const matchesStatus = selectedStatus === '' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Get unique categories for filter
  const categories = [...new Set(products.map(p => p.categoryName).filter(Boolean))];
  
  // Prepare options for Select components
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(category => ({ value: category, label: category }))
  ];
  
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];
  
  const itemsPerPageOptions = [
    { value: 6, label: '6' },
    { value: 12, label: '12' },
    { value: 24, label: '24' },
    { value: 48, label: '48' }
  ];

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleEditProduct = (product) => {
    // Navigate to edit page or open edit modal
    console.log('Edit product:', product);
    success(`Edit functionality for ${product.productName} - Coming soon!`);
  };

  const handleDeleteProduct = (product) => {
    if (window.confirm(`Are you sure you want to delete ${product.productName}?`)) {
      // Implement delete functionality
      console.log('Delete product:', product);
      success(`Delete functionality for ${product.productName} - Coming soon!`);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const ListView = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Product
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              RFID Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Weight
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              MRP
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {paginatedProducts.map((product, index) => (
            <tr key={product.id || index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {product.productName}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {product.itemCode}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {product.categoryName}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {product.rfidCode}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                <div>
                  <div>Gross: {product.grossWeight}g</div>
                  <div className="text-xs text-gray-500">Net: {product.netWeight}g</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                ₹{product.mrp?.toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {product.status || 'Active'}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const GridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {paginatedProducts.map((product, index) => (
        <Card key={product.id || index} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <Package className="h-16 w-16 text-white" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {product.productName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {product.itemCode}
            </p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Category:</span>
                <span className="text-gray-900 dark:text-white">{product.categoryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">RFID:</span>
                <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 px-1 rounded">
                  {product.rfidCode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Weight:</span>
                <span className="text-gray-900 dark:text-white">{product.grossWeight}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">MRP:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  ₹{product.mrp?.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t dark:border-gray-700">
              <div className="flex justify-between items-center mb-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  product.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {product.status || 'Active'}
                </span>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewProduct(product)}
                  className="flex-1"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditProduct(product)}
                  className="flex-1"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteProduct(product)}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mb-4">
        {/* Label - Left Side */}
        <label className="flex-shrink-0 text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap">
          Inventory Management
        </label>
        
        {/* Filter, Refresh, and Add - Right Side */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto"
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
          </Button>
          
          {/* Refresh Button */}
          <Button
            variant="outline"
            onClick={loadProducts}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          
          {/* Add Product Button */}
          <Button variant="accent" className="flex items-center gap-1.5 px-3 py-1.5 text-xs h-auto">
            <Plus className="h-3.5 w-3.5" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* Search and View Toggle */}
      <Card>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search products by name, item code, or RFID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={Search}
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={selectedCategory}
                onChange={setSelectedCategory}
                placeholder="All Categories"
                options={categoryOptions}
              />
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                placeholder="All Status"
                options={statusOptions}
              />
              <Button
                variant="outline"
                onClick={clearFilters}
                className="whitespace-nowrap"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <span>
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
        </span>
        <div className="flex items-center space-x-2">
          <span>Items per page:</span>
          <Select
            value={itemsPerPage}
            onChange={setItemsPerPage}
            className="w-20"
            options={itemsPerPageOptions}
          />
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading products...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProducts.length === 0 && (
        <Card className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No products found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {searchQuery || selectedCategory || selectedStatus 
              ? 'Try adjusting your search or filters' 
              : 'Start by adding some products to your inventory'
            }
          </p>
          {(searchQuery || selectedCategory || selectedStatus) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </Card>
      )}

      {/* Products Display */}
      {!loading && filteredProducts.length > 0 && (
        <>
          {viewMode === 'list' ? <ListView /> : <GridView />}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <Modal
          isOpen={showProductModal}
          onClose={() => setShowProductModal(false)}
          title="Product Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Product Name</label>
                <p className="text-gray-900 dark:text-white">{selectedProduct.productName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Item Code</label>
                <p className="text-gray-900 dark:text-white">{selectedProduct.itemCode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</label>
                <p className="text-gray-900 dark:text-white">{selectedProduct.categoryName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">RFID Code</label>
                <p className="font-mono text-gray-900 dark:text-white">{selectedProduct.rfidCode}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Gross Weight</label>
                <p className="text-gray-900 dark:text-white">{selectedProduct.grossWeight}g</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Net Weight</label>
                <p className="text-gray-900 dark:text-white">{selectedProduct.netWeight}g</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">MRP</label>
                <p className="text-gray-900 dark:text-white">₹{selectedProduct.mrp?.toLocaleString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedProduct.status === 'Active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                }`}>
                  {selectedProduct.status || 'Active'}
                </span>
              </div>
            </div>
            <div className="flex justify-end space-x-3 pt-4 border-t dark:border-gray-700">
              <Button
                variant="outline"
                onClick={() => setShowProductModal(false)}
              >
                Close
              </Button>
              <Button
                variant="accent"
                onClick={() => {
                  setShowProductModal(false);
                  handleEditProduct(selectedProduct);
                }}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InventoryPage;
