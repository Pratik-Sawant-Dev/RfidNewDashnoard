import React, { useState, useEffect } from 'react';
import { Plus, Search, Package, Tag, AlertCircle, CheckCircle, Loader2, Edit, Trash2 } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import apiService from '../services/apiService';
import useToast from '../hooks/useToast';

const AddStockPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({
    itemCode: '',
    categoryName: '',
    branchName: '',
    counterName: '',
    productName: '',
    designName: '',
    purityName: '',
    rfidCode: '',
    grossWeight: '',
    netWeight: '',
    stoneWeight: '',
    diamondHeight: '',
    boxDetails: '',
    size: '',
    stoneAmount: '',
    diamondAmount: '',
    hallmarkAmount: '',
    makingPerGram: '',
    makingPercentage: '',
    makingFixedAmount: '',
    mrp: '',
    status: 'Active'
  });
  const { success, error } = useToast();

  // Master data states
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [counters, setCounters] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [purities, setPurities] = useState([]);
  const [boxes, setBoxes] = useState([]);

  // Load all products and master data on component mount
  useEffect(() => {
    loadProducts();
    loadMasterData();
  }, []);

  // Load master data from APIs
  const loadMasterData = async () => {
    try {
      const [categoriesRes, branchesRes, countersRes, designsRes, puritiesRes, boxesRes] = await Promise.all([
        apiService.getCategories(),
        apiService.getBranches(),
        apiService.getCounters(),
        apiService.getDesigns(),
        apiService.getPurities(),
        apiService.getBoxes()
      ]);

      setCategories(categoriesRes.data || categoriesRes || []);
      setBranches(branchesRes.data || branchesRes || []);
      setCounters(countersRes.data || countersRes || []);
      setDesigns(designsRes.data || designsRes || []);
      setPurities(puritiesRes.data || puritiesRes || []);
      setBoxes(boxesRes.data || boxesRes || []);
    } catch (error) {
      console.error('Error loading master data:', error);
      error('Failed to load master data');
    }
  };

  // Load products from API
  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllProducts();
      setStockItems(response.data || response || []);
    } catch (error) {
      console.error('Error loading products:', error);
      error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  // Search products using API
  const searchProducts = async (searchParams = {}) => {
    try {
      setSearchLoading(true);
      const response = await apiService.searchProducts(searchParams);
      setStockItems(response.data || response || []);
    } catch (error) {
      console.error('Error searching products:', error);
      error('Failed to search products');
    } finally {
      setSearchLoading(false);
    }
  };

  // Handle search input change with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchProducts({
          categoryName: searchTerm,
          productName: searchTerm
        });
      } else {
        loadProducts();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleAddItem = async () => {
    if (newItem.itemCode && newItem.productName && newItem.categoryName && newItem.mrp) {
      try {
        setLoading(true);
        const productData = {
          itemCode: newItem.itemCode,
          categoryName: newItem.categoryName,
          branchName: newItem.branchName || branches[0]?.name || 'Main Branch',
          counterName: newItem.counterName || counters[0]?.name || 'Counter 1',
          productName: newItem.productName,
          designName: newItem.designName || designs[0]?.name || 'Classic',
          purityName: newItem.purityName || purities[0]?.name || '18K',
          rfidCode: newItem.rfidCode || `RFID-${Date.now()}`,
          grossWeight: parseFloat(newItem.grossWeight) || 0,
          netWeight: parseFloat(newItem.netWeight) || 0,
          stoneWeight: parseFloat(newItem.stoneWeight) || 0,
          diamondHeight: parseFloat(newItem.diamondHeight) || 0,
          boxDetails: newItem.boxDetails || '',
          size: parseFloat(newItem.size) || 0,
          stoneAmount: parseFloat(newItem.stoneAmount) || 0,
          diamondAmount: parseFloat(newItem.diamondAmount) || 0,
          hallmarkAmount: parseFloat(newItem.hallmarkAmount) || 0,
          makingPerGram: parseFloat(newItem.makingPerGram) || 0,
          makingPercentage: parseFloat(newItem.makingPercentage) || 0,
          makingFixedAmount: parseFloat(newItem.makingFixedAmount) || 0,
          mrp: parseFloat(newItem.mrp),
          status: newItem.status || 'Active'
        };

        const response = await apiService.createProduct(productData);
        success('Product added successfully');
        
        // Reset form
      setNewItem({
          itemCode: '',
          categoryName: '',
          branchName: '',
          counterName: '',
        productName: '',
          designName: '',
          purityName: '',
          rfidCode: '',
          grossWeight: '',
          netWeight: '',
          stoneWeight: '',
          diamondHeight: '',
          boxDetails: '',
          size: '',
          stoneAmount: '',
          diamondAmount: '',
          hallmarkAmount: '',
          makingPerGram: '',
          makingPercentage: '',
          makingFixedAmount: '',
          mrp: '',
          status: 'Active'
      });
      setShowAddModal(false);
        
        // Reload products
        loadProducts();
      } catch (error) {
        console.error('Error adding product:', error);
        error('Failed to add product');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      itemCode: item.itemCode || '',
      categoryName: item.categoryName || '',
      branchName: item.branchName || '',
      counterName: item.counterName || '',
      productName: item.productName || '',
      designName: item.designName || '',
      purityName: item.purityName || '',
      rfidCode: item.rfidCode || '',
      grossWeight: item.grossWeight || '',
      netWeight: item.netWeight || '',
      stoneWeight: item.stoneWeight || '',
      diamondHeight: item.diamondHeight || '',
      boxDetails: item.boxDetails || '',
      size: item.size || '',
      stoneAmount: item.stoneAmount || '',
      diamondAmount: item.diamondAmount || '',
      hallmarkAmount: item.hallmarkAmount || '',
      makingPerGram: item.makingPerGram || '',
      makingPercentage: item.makingPercentage || '',
      makingFixedAmount: item.makingFixedAmount || '',
      mrp: item.mrp || '',
      status: item.status || 'Active'
    });
    setShowEditModal(true);
  };

  const handleUpdateItem = async () => {
    if (editingItem && newItem.itemCode && newItem.productName && newItem.categoryName && newItem.mrp) {
      try {
        setLoading(true);
        const productData = {
          itemCode: newItem.itemCode,
          categoryName: newItem.categoryName,
          branchName: newItem.branchName || branches[0]?.name || 'Main Branch',
          counterName: newItem.counterName || counters[0]?.name || 'Counter 1',
          productName: newItem.productName,
          designName: newItem.designName || designs[0]?.name || 'Classic',
          purityName: newItem.purityName || purities[0]?.name || '18K',
          rfidCode: newItem.rfidCode || `RFID-${Date.now()}`,
          grossWeight: parseFloat(newItem.grossWeight) || 0,
          netWeight: parseFloat(newItem.netWeight) || 0,
          stoneWeight: parseFloat(newItem.stoneWeight) || 0,
          diamondHeight: parseFloat(newItem.diamondHeight) || 0,
          boxDetails: newItem.boxDetails || '',
          size: parseFloat(newItem.size) || 0,
          stoneAmount: parseFloat(newItem.stoneAmount) || 0,
          diamondAmount: parseFloat(newItem.diamondAmount) || 0,
          hallmarkAmount: parseFloat(newItem.hallmarkAmount) || 0,
          makingPerGram: parseFloat(newItem.makingPerGram) || 0,
          makingPercentage: parseFloat(newItem.makingPercentage) || 0,
          makingFixedAmount: parseFloat(newItem.makingFixedAmount) || 0,
          mrp: parseFloat(newItem.mrp),
          status: newItem.status || 'Active'
        };

        await apiService.updateProduct(editingItem.id, productData);
        success('Product updated successfully');
        
        // Reset form
        setNewItem({
          itemCode: '',
          categoryName: '',
          branchName: '',
          counterName: '',
          productName: '',
          designName: '',
          purityName: '',
          rfidCode: '',
          grossWeight: '',
          netWeight: '',
          stoneWeight: '',
          diamondHeight: '',
          boxDetails: '',
          size: '',
          stoneAmount: '',
          diamondAmount: '',
          hallmarkAmount: '',
          makingPerGram: '',
          makingPercentage: '',
          makingFixedAmount: '',
          mrp: '',
          status: 'Active'
        });
        setEditingItem(null);
        setShowEditModal(false);
        
        // Reload products
        loadProducts();
      } catch (error) {
        console.error('Error updating product:', error);
        error('Failed to update product');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await apiService.deleteProduct(itemId);
        success('Product deleted successfully');
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        error('Failed to delete product');
      } finally {
        setLoading(false);
      }
    }
  };

  // Since we're using API search, filteredItems is the same as stockItems
  const filteredItems = stockItems;

  const generateRFIDTag = () => {
    const tag = `RFID-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    setNewItem({...newItem, rfidCode: tag});
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Add Stock
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Add new jewelry items to your inventory with RFID tracking
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-3">
          <div className="flex items-center space-x-3">
            <Search className="w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products by name, SKU, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent focus:ring-0"
            />
            {searchLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
          </div>
        </Card>
        
        <Card>
          <div className="text-center">
            <Package className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {stockItems.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Total Items
            </p>
          </div>
        </Card>
      </div>

      {/* Stock Items Table */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Inventory Items
          </h3>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {filteredItems.length} items
          </span>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500 dark:text-gray-400">Loading products...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm ? 'No items found matching your search.' : 'No items added yet. Click "Add New Item" to get started.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                 <tr className="border-b border-gray-200 dark:border-gray-700">
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     Item Code
                   </th>
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     Product Name
                   </th>
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     Category
                   </th>
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     Branch
                   </th>
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     Counter
                   </th>
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     MRP
                   </th>
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     RFID Code
                   </th>
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     Status
                   </th>
                   <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">
                     Actions
                   </th>
                 </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {item.itemCode}
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {item.designName} - {item.purityName}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {item.categoryName}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {item.branchName}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      {item.counterName}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                      ₹{item.mrp?.toLocaleString() || '0'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                          {item.rfidCode}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {item.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditItem(item)}
                          className="p-1 h-8 w-8"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1 h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

       {/* Add Item Modal */}
       <Modal
         isOpen={showAddModal}
         onClose={() => setShowAddModal(false)}
         title="Add New Stock Item"
         size="xl"
       >
         <div className="space-y-6 max-h-96 overflow-y-auto">
           {/* Basic Information */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input
                 label="Item Code"
                 value={newItem.itemCode}
                 onChange={(e) => setNewItem({...newItem, itemCode: e.target.value})}
                 placeholder="Enter item code"
               />
               <Input
                 label="Product Name"
                 value={newItem.productName}
                 onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                 placeholder="Enter product name"
               />
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Category
                 </label>
                 <select
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   value={newItem.categoryName}
                   onChange={(e) => setNewItem({...newItem, categoryName: e.target.value})}
                 >
                   <option value="">Select category</option>
                   {categories.map(category => (
                     <option key={category.id || category} value={category.name || category}>
                       {category.name || category}
                     </option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Branch
                 </label>
                 <select
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   value={newItem.branchName}
                   onChange={(e) => setNewItem({...newItem, branchName: e.target.value})}
                 >
                   <option value="">Select branch</option>
                   {branches.map(branch => (
                     <option key={branch.id || branch} value={branch.name || branch}>
                       {branch.name || branch}
                     </option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Counter
                 </label>
                 <select
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   value={newItem.counterName}
                   onChange={(e) => setNewItem({...newItem, counterName: e.target.value})}
                 >
                   <option value="">Select counter</option>
                   {counters.map(counter => (
                     <option key={counter.id || counter} value={counter.name || counter}>
                       {counter.name || counter}
                     </option>
                   ))}
                 </select>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Design
                 </label>
                 <select
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   value={newItem.designName}
                   onChange={(e) => setNewItem({...newItem, designName: e.target.value})}
                 >
                   <option value="">Select design</option>
                   {designs.map(design => (
                     <option key={design.id || design} value={design.name || design}>
                       {design.name || design}
                     </option>
                   ))}
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Purity
                 </label>
                 <select
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   value={newItem.purityName}
                   onChange={(e) => setNewItem({...newItem, purityName: e.target.value})}
                 >
                   <option value="">Select purity</option>
                   {purities.map(purity => (
                     <option key={purity.id || purity} value={purity.name || purity}>
                       {purity.name || purity}
                     </option>
                   ))}
                 </select>
               </div>
             </div>
           </div>

           {/* Weight and Measurements */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weight & Measurements</h3>
             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <Input
                 label="Gross Weight (g)"
                 type="number"
                 step="0.01"
                 value={newItem.grossWeight}
                 onChange={(e) => setNewItem({...newItem, grossWeight: e.target.value})}
                 placeholder="0.00"
               />
               <Input
                 label="Net Weight (g)"
                 type="number"
                 step="0.01"
                 value={newItem.netWeight}
                 onChange={(e) => setNewItem({...newItem, netWeight: e.target.value})}
                 placeholder="0.00"
               />
               <Input
                 label="Stone Weight (g)"
                 type="number"
                 step="0.01"
                 value={newItem.stoneWeight}
                 onChange={(e) => setNewItem({...newItem, stoneWeight: e.target.value})}
                 placeholder="0.00"
               />
               <Input
                 label="Diamond Height (mm)"
                 type="number"
                 step="0.01"
                 value={newItem.diamondHeight}
                 onChange={(e) => setNewItem({...newItem, diamondHeight: e.target.value})}
                 placeholder="0.00"
               />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input
                 label="Size"
                 type="number"
                 step="0.1"
                 value={newItem.size}
                 onChange={(e) => setNewItem({...newItem, size: e.target.value})}
                 placeholder="0.0"
               />
               <Input
                 label="Box Details"
                 value={newItem.boxDetails}
                 onChange={(e) => setNewItem({...newItem, boxDetails: e.target.value})}
                 placeholder="Enter box details"
               />
             </div>
           </div>

           {/* Pricing */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Input
                 label="Stone Amount (₹)"
                 type="number"
                 step="0.01"
                 value={newItem.stoneAmount}
                 onChange={(e) => setNewItem({...newItem, stoneAmount: e.target.value})}
                 placeholder="0.00"
               />
               <Input
                 label="Diamond Amount (₹)"
                 type="number"
                 step="0.01"
                 value={newItem.diamondAmount}
                 onChange={(e) => setNewItem({...newItem, diamondAmount: e.target.value})}
                 placeholder="0.00"
               />
               <Input
                 label="Hallmark Amount (₹)"
                 type="number"
                 step="0.01"
                 value={newItem.hallmarkAmount}
                 onChange={(e) => setNewItem({...newItem, hallmarkAmount: e.target.value})}
                 placeholder="0.00"
               />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Input
                 label="Making Per Gram (₹)"
                 type="number"
                 step="0.01"
                 value={newItem.makingPerGram}
                 onChange={(e) => setNewItem({...newItem, makingPerGram: e.target.value})}
                 placeholder="0.00"
               />
               <Input
                 label="Making Percentage (%)"
                 type="number"
                 step="0.01"
                 value={newItem.makingPercentage}
                 onChange={(e) => setNewItem({...newItem, makingPercentage: e.target.value})}
                 placeholder="0.00"
               />
               <Input
                 label="Making Fixed Amount (₹)"
                 type="number"
                 step="0.01"
                 value={newItem.makingFixedAmount}
                 onChange={(e) => setNewItem({...newItem, makingFixedAmount: e.target.value})}
                 placeholder="0.00"
               />
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <Input
                 label="MRP (₹)"
                 type="number"
                 step="0.01"
                 value={newItem.mrp}
                 onChange={(e) => setNewItem({...newItem, mrp: e.target.value})}
                 placeholder="0.00"
               />
               <div>
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                   Status
                 </label>
                 <select
                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                   value={newItem.status}
                   onChange={(e) => setNewItem({...newItem, status: e.target.value})}
                 >
                   <option value="Active">Active</option>
                   <option value="Inactive">Inactive</option>
                 </select>
               </div>
             </div>
           </div>

           {/* RFID */}
           <div className="space-y-4">
             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">RFID Tracking</h3>
             <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                 RFID Code
               </label>
               <div className="flex space-x-2">
                 <Input
                   value={newItem.rfidCode}
                   onChange={(e) => setNewItem({...newItem, rfidCode: e.target.value})}
                   placeholder="Auto-generated or enter custom"
                   className="flex-1"
                 />
                 <Button
                   variant="outline"
                   onClick={generateRFIDTag}
                   className="whitespace-nowrap"
                 >
                   Generate
                 </Button>
               </div>
             </div>
           </div>

           <div className="flex justify-end space-x-3 pt-4">
             <Button
               variant="outline"
               onClick={() => setShowAddModal(false)}
             >
               Cancel
             </Button>
             <Button
               variant="accent"
               onClick={handleAddItem}
               disabled={!newItem.itemCode || !newItem.productName || !newItem.categoryName || !newItem.mrp || loading}
             >
               {loading ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Adding...
                 </>
               ) : (
                 'Add to Stock'
               )}
             </Button>
           </div>
         </div>
       </Modal>

      {/* Edit Item Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingItem(null);
          setNewItem({
            itemCode: '',
            categoryName: '',
            branchName: '',
            counterName: '',
            productName: '',
            designName: '',
            purityName: '',
            rfidCode: '',
            grossWeight: '',
            netWeight: '',
            stoneWeight: '',
            diamondHeight: '',
            boxDetails: '',
            size: '',
            stoneAmount: '',
            diamondAmount: '',
            hallmarkAmount: '',
            makingPerGram: '',
            makingPercentage: '',
            makingFixedAmount: '',
            mrp: '',
            status: 'Active'
          });
        }}
        title="Edit Stock Item"
        size="xl"
      >
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Item Code"
                value={newItem.itemCode}
                onChange={(e) => setNewItem({...newItem, itemCode: e.target.value})}
                placeholder="Enter item code"
              />
              <Input
                label="Product Name"
                value={newItem.productName}
                onChange={(e) => setNewItem({...newItem, productName: e.target.value})}
                placeholder="Enter product name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={newItem.categoryName}
                  onChange={(e) => setNewItem({...newItem, categoryName: e.target.value})}
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category.id || category} value={category.name || category}>
                      {category.name || category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Branch
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={newItem.branchName}
                  onChange={(e) => setNewItem({...newItem, branchName: e.target.value})}
                >
                  <option value="">Select branch</option>
                  {branches.map(branch => (
                    <option key={branch.id || branch} value={branch.name || branch}>
                      {branch.name || branch}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Counter
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={newItem.counterName}
                  onChange={(e) => setNewItem({...newItem, counterName: e.target.value})}
                >
                  <option value="">Select counter</option>
                  {counters.map(counter => (
                    <option key={counter.id || counter} value={counter.name || counter}>
                      {counter.name || counter}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Design
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={newItem.designName}
                  onChange={(e) => setNewItem({...newItem, designName: e.target.value})}
                >
                  <option value="">Select design</option>
                  {designs.map(design => (
                    <option key={design.id || design} value={design.name || design}>
                      {design.name || design}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Purity
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={newItem.purityName}
                  onChange={(e) => setNewItem({...newItem, purityName: e.target.value})}
                >
                  <option value="">Select purity</option>
                  {purities.map(purity => (
                    <option key={purity.id || purity} value={purity.name || purity}>
                      {purity.name || purity}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Weight and Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Weight & Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                label="Gross Weight (g)"
                type="number"
                step="0.01"
                value={newItem.grossWeight}
                onChange={(e) => setNewItem({...newItem, grossWeight: e.target.value})}
                placeholder="0.00"
              />
              <Input
                label="Net Weight (g)"
                type="number"
                step="0.01"
                value={newItem.netWeight}
                onChange={(e) => setNewItem({...newItem, netWeight: e.target.value})}
                placeholder="0.00"
              />
              <Input
                label="Stone Weight (g)"
                type="number"
                step="0.01"
                value={newItem.stoneWeight}
                onChange={(e) => setNewItem({...newItem, stoneWeight: e.target.value})}
                placeholder="0.00"
              />
              <Input
                label="Diamond Height (mm)"
                type="number"
                step="0.01"
                value={newItem.diamondHeight}
                onChange={(e) => setNewItem({...newItem, diamondHeight: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Size"
                type="number"
                step="0.1"
                value={newItem.size}
                onChange={(e) => setNewItem({...newItem, size: e.target.value})}
                placeholder="0.0"
              />
              <Input
                label="Box Details"
                value={newItem.boxDetails}
                onChange={(e) => setNewItem({...newItem, boxDetails: e.target.value})}
                placeholder="Enter box details"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Stone Amount (₹)"
                type="number"
                step="0.01"
                value={newItem.stoneAmount}
                onChange={(e) => setNewItem({...newItem, stoneAmount: e.target.value})}
                placeholder="0.00"
              />
              <Input
                label="Diamond Amount (₹)"
                type="number"
                step="0.01"
                value={newItem.diamondAmount}
                onChange={(e) => setNewItem({...newItem, diamondAmount: e.target.value})}
                placeholder="0.00"
              />
              <Input
                label="Hallmark Amount (₹)"
                type="number"
                step="0.01"
                value={newItem.hallmarkAmount}
                onChange={(e) => setNewItem({...newItem, hallmarkAmount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="Making Per Gram (₹)"
                type="number"
                step="0.01"
                value={newItem.makingPerGram}
                onChange={(e) => setNewItem({...newItem, makingPerGram: e.target.value})}
                placeholder="0.00"
              />
              <Input
                label="Making Percentage (%)"
                type="number"
                step="0.01"
                value={newItem.makingPercentage}
                onChange={(e) => setNewItem({...newItem, makingPercentage: e.target.value})}
                placeholder="0.00"
              />
              <Input
                label="Making Fixed Amount (₹)"
                type="number"
                step="0.01"
                value={newItem.makingFixedAmount}
                onChange={(e) => setNewItem({...newItem, makingFixedAmount: e.target.value})}
                placeholder="0.00"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="MRP (₹)"
                type="number"
                step="0.01"
                value={newItem.mrp}
                onChange={(e) => setNewItem({...newItem, mrp: e.target.value})}
                placeholder="0.00"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={newItem.status}
                  onChange={(e) => setNewItem({...newItem, status: e.target.value})}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* RFID */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">RFID Tracking</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                RFID Code
              </label>
              <div className="flex space-x-2">
                <Input
                  value={newItem.rfidCode}
                  onChange={(e) => setNewItem({...newItem, rfidCode: e.target.value})}
                  placeholder="Auto-generated or enter custom"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={generateRFIDTag}
                  className="whitespace-nowrap"
                >
                  Generate
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setShowEditModal(false);
                setEditingItem(null);
                setNewItem({
                  itemCode: '',
                  categoryName: '',
                  branchName: '',
                  counterName: '',
                  productName: '',
                  designName: '',
                  purityName: '',
                  rfidCode: '',
                  grossWeight: '',
                  netWeight: '',
                  stoneWeight: '',
                  diamondHeight: '',
                  boxDetails: '',
                  size: '',
                  stoneAmount: '',
                  diamondAmount: '',
                  hallmarkAmount: '',
                  makingPerGram: '',
                  makingPercentage: '',
                  makingFixedAmount: '',
                  mrp: '',
                  status: 'Active'
                });
              }}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleUpdateItem}
              disabled={!newItem.itemCode || !newItem.productName || !newItem.categoryName || !newItem.mrp || loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Item'
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddStockPage;
